import {
  FREE_SHIPPING_FROM,
  MAX_LINE_QUANTITY,
  PRODUCTS,
  SHIPPING_FEE,
} from './shop-content';
import type {
  CartLine,
  CartLineModel,
  CartTotals,
  Product,
  ShopCategoryFilter,
} from '../types/shop.types';

/** `2.450.000₫` */
export function formatVnd(value: number): string {
  return `${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}₫`;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();
}

export function findProduct(productId: string): Product | undefined {
  return PRODUCTS.find(product => product.id === productId);
}

export function filterProducts(
  category: ShopCategoryFilter,
  query: string,
): readonly Product[] {
  const needle = normalize(query);

  return PRODUCTS.filter(product => {
    if (category !== 'Tất cả' && product.category !== category) {
      return false;
    }
    return (
      needle === '' ||
      normalize(
        `${product.name} ${product.subtitle} ${product.category}`,
      ).includes(needle)
    );
  });
}

/** Size preselected when a product opens: the second one, like a medium. */
export function defaultSize(product: Product): string {
  return product.sizes[Math.min(1, product.sizes.length - 1)];
}

export function addToCart(
  lines: readonly CartLine[],
  line: CartLine,
): readonly CartLine[] {
  const index = lines.findIndex(
    item => item.productId === line.productId && item.size === line.size,
  );

  if (index < 0) {
    return [...lines, line];
  }

  return lines.map((item, position) =>
    position === index
      ? {
          ...item,
          quantity: Math.min(MAX_LINE_QUANTITY, item.quantity + line.quantity),
        }
      : item,
  );
}

/** Changes a line's quantity; a line that drops to zero is removed. */
export function changeLineQuantity(
  lines: readonly CartLine[],
  index: number,
  delta: number,
): readonly CartLine[] {
  return lines.flatMap((line, position) => {
    if (position !== index) {
      return [line];
    }
    const quantity = Math.min(MAX_LINE_QUANTITY, line.quantity + delta);
    return quantity > 0 ? [{ ...line, quantity }] : [];
  });
}

export function buildCartLines(
  lines: readonly CartLine[],
): readonly CartLineModel[] {
  return lines.flatMap(line => {
    const product = findProduct(line.productId);
    return product
      ? [{ ...line, product, lineTotal: product.price * line.quantity }]
      : [];
  });
}

export function computeTotals(lines: readonly CartLineModel[]): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

  return { subtotal, shipping, total: subtotal + shipping };
}

export function countItems(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Splits a list into rows of `size` items for the product grid. */
export function chunk<T>(items: readonly T[], size: number): readonly T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}
