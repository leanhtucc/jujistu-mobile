export type ShopCategory = 'Gi' | 'Rashguard' | 'Đai' | 'Phụ kiện' | 'Vé';

export type ShopCategoryFilter = 'Tất cả' | ShopCategory;

export type ProductTagVariant = 'accent' | 'solid' | 'neutral';

export interface Product {
  readonly id: string;
  readonly category: ShopCategory;
  readonly name: string;
  readonly subtitle: string;
  readonly price: number;
  readonly oldPrice?: number;
  readonly tag?: string;
  readonly tagVariant?: ProductTagVariant;
  readonly sizes: readonly string[];
  /** Caption of the product photo placeholder. */
  readonly imageLabel: string;
}

export interface CartLine {
  readonly productId: string;
  readonly size: string;
  readonly quantity: number;
}

export interface CartLineModel extends CartLine {
  readonly product: Product;
  readonly lineTotal: number;
}

export interface CartTotals {
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
}

export type CheckoutStatus = 'idle' | 'paying' | 'done';
