import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DROP_PRODUCT_ID,
  INITIAL_CART,
  MAX_LINE_QUANTITY,
  MOCK_CHECKOUT_MS,
  SHOP_CATEGORIES,
} from '../data/shop-content';
import {
  addToCart,
  buildCartLines,
  changeLineQuantity,
  computeTotals,
  countItems,
  defaultSize,
  filterProducts,
  findProduct,
} from '../data/shop-selectors';
import type {
  CartLine,
  CartLineModel,
  CartTotals,
  CheckoutStatus,
  Product,
  ShopCategoryFilter,
} from '../types/shop.types';

const TOAST_MS = 2400;

export interface ProductSheetState {
  readonly product: Product;
  readonly size: string;
  readonly quantity: number;
  readonly total: number;
}

export interface UseShopOptions {
  /** Called when a ticket product is chosen instead of opening the sheet. */
  readonly onOpenTicket?: (zone: 'vip' | 'a') => void;
}

export interface UseShopResult {
  readonly categories: readonly ShopCategoryFilter[];
  readonly category: ShopCategoryFilter;
  readonly selectCategory: (category: ShopCategoryFilter) => void;
  readonly query: string;
  readonly setQuery: (value: string) => void;
  readonly clearQuery: () => void;
  readonly products: readonly Product[];
  /** The drop card shows only on the unfiltered catalogue. */
  readonly showDrop: boolean;
  readonly dropProduct: Product | null;
  readonly openProduct: (product: Product) => void;
  readonly quickAdd: (product: Product) => void;
  readonly sheet: ProductSheetState | null;
  readonly closeSheet: () => void;
  readonly selectSize: (size: string) => void;
  readonly changeQuantity: (delta: number) => void;
  readonly addFromSheet: () => void;
  readonly cartCount: number;
  readonly cartLines: readonly CartLineModel[];
  readonly totals: CartTotals;
  readonly cartOpen: boolean;
  readonly openCart: () => void;
  readonly closeCart: () => void;
  readonly changeCartLine: (index: number, delta: number) => void;
  readonly checkoutStatus: CheckoutStatus;
  readonly checkout: () => void;
  readonly finishOrder: () => void;
  readonly toast: string | null;
}

export function useShop({ onOpenTicket }: UseShopOptions = {}): UseShopResult {
  const [category, setCategory] = useState<ShopCategoryFilter>('Tất cả');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<readonly CartLine[]>(INITIAL_CART);
  const [sheetProduct, setSheetProduct] = useState<Product | null>(null);
  const [sheetSize, setSheetSize] = useState('');
  const [sheetQuantity, setSheetQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>('idle');
  const [toast, setToast] = useState<string | null>(null);

  const checkoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (checkoutTimer.current) {
        clearTimeout(checkoutTimer.current);
      }
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const products = useMemo(
    () => filterProducts(category, query),
    [category, query],
  );
  const cartLines = useMemo(() => buildCartLines(cart), [cart]);
  const totals = useMemo(() => computeTotals(cartLines), [cartLines]);

  const openProduct = useCallback(
    (product: Product) => {
      if (product.category === 'Vé') {
        onOpenTicket?.(product.id === 'tk-vip' ? 'vip' : 'a');
        return;
      }
      setSheetProduct(product);
      setSheetSize(defaultSize(product));
      setSheetQuantity(1);
    },
    [onOpenTicket],
  );

  const addLine = useCallback(
    (product: Product, size: string, quantity: number) => {
      setCart(lines =>
        addToCart(lines, { productId: product.id, size, quantity }),
      );
      showToast('Đã thêm vào giỏ hàng');
    },
    [showToast],
  );

  const quickAdd = useCallback(
    (product: Product) => {
      if (product.category === 'Vé' || product.sizes.length > 1) {
        openProduct(product);
        return;
      }
      addLine(product, product.sizes[0], 1);
    },
    [addLine, openProduct],
  );

  const addFromSheet = useCallback(() => {
    if (!sheetProduct) {
      return;
    }
    addLine(sheetProduct, sheetSize, sheetQuantity);
    setSheetProduct(null);
  }, [addLine, sheetProduct, sheetQuantity, sheetSize]);

  const changeQuantity = useCallback((delta: number) => {
    setSheetQuantity(value =>
      Math.min(MAX_LINE_QUANTITY, Math.max(1, value + delta)),
    );
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
    setCheckoutStatus(status => (status === 'done' ? 'idle' : status));
  }, []);

  const checkout = useCallback(() => {
    if (checkoutStatus !== 'idle' || cart.length === 0) {
      return;
    }
    setCheckoutStatus('paying');
    checkoutTimer.current = setTimeout(
      () => setCheckoutStatus('done'),
      MOCK_CHECKOUT_MS,
    );
  }, [cart.length, checkoutStatus]);

  const finishOrder = useCallback(() => {
    setCheckoutStatus('idle');
    setCart([]);
    setCartOpen(false);
  }, []);

  const sheet = useMemo<ProductSheetState | null>(
    () =>
      sheetProduct
        ? {
            product: sheetProduct,
            size: sheetSize,
            quantity: sheetQuantity,
            total: sheetProduct.price * sheetQuantity,
          }
        : null,
    [sheetProduct, sheetQuantity, sheetSize],
  );

  const dropProduct = useMemo(() => findProduct(DROP_PRODUCT_ID) ?? null, []);

  return {
    categories: SHOP_CATEGORIES,
    category,
    selectCategory: setCategory,
    query,
    setQuery,
    clearQuery: () => setQuery(''),
    products,
    showDrop: category === 'Tất cả' && query.trim() === '',
    dropProduct,
    openProduct,
    quickAdd,
    sheet,
    closeSheet: () => setSheetProduct(null),
    selectSize: setSheetSize,
    changeQuantity,
    addFromSheet,
    cartCount: countItems(cart),
    cartLines,
    totals,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart,
    changeCartLine: (index, delta) =>
      setCart(lines => changeLineQuantity(lines, index, delta)),
    checkoutStatus,
    checkout,
    finishOrder,
    toast,
  };
}
