import type { Product, ShopCategoryFilter } from '../types/shop.types';

/**
 * Static catalogue for the v4 prototype (Phase 1). Replaced by feature hooks
 * and services when the shop API is available.
 */

export const SHOP_CATEGORIES: readonly ShopCategoryFilter[] = [
  'Tất cả',
  'Gi',
  'Rashguard',
  'Đai',
  'Phụ kiện',
  'Vé',
];

export const PRODUCTS: readonly Product[] = [
  {
    id: 'gi-pro',
    category: 'Gi',
    name: 'Gi thi đấu Sen Vàng Pro',
    subtitle: 'Pearl weave 450 gsm · Trắng',
    price: 2_450_000,
    oldPrice: 2_890_000,
    tag: '-15%',
    tagVariant: 'accent',
    sizes: ['A1', 'A2', 'A3', 'A4'],
    imageLabel: 'ẢNH GI TRẮNG',
  },
  {
    id: 'rash',
    category: 'Rashguard',
    name: 'Rashguard Giải Quốc gia 2026',
    subtitle: 'Dài tay · In thăng hoa',
    price: 690_000,
    tag: 'Mới',
    tagVariant: 'solid',
    sizes: ['S', 'M', 'L', 'XL'],
    imageLabel: 'ẢNH RASHGUARD',
  },
  {
    id: 'gi-lite',
    category: 'Gi',
    name: 'Gi tập Tre Xanh Lite',
    subtitle: 'Nhẹ 350 gsm · Xanh navy',
    price: 1_690_000,
    sizes: ['A0', 'A1', 'A2', 'A3'],
    imageLabel: 'ẢNH GI NAVY',
  },
  {
    id: 'short',
    category: 'Rashguard',
    name: 'Quần grappling NoGi',
    subtitle: 'Co giãn 4 chiều',
    price: 550_000,
    tag: 'Còn 3',
    tagVariant: 'neutral',
    sizes: ['S', 'M', 'L', 'XL'],
    imageLabel: 'ẢNH QUẦN NOGI',
  },
  {
    id: 'tk-std',
    category: 'Vé',
    name: 'Vé Giải Quốc gia · Khán đài A',
    subtitle: '28/09 · Vào cửa 18:45',
    price: 250_000,
    tag: 'Mở bán',
    tagVariant: 'neutral',
    sizes: ['1 vé'],
    imageLabel: 'VÉ KHÁN ĐÀI',
  },
  {
    id: 'tk-vip',
    category: 'Vé',
    name: 'Vé VIP chung kết · Giải Quốc gia',
    subtitle: 'Ghế sát thảm · Kèm rashguard',
    price: 450_000,
    sizes: ['1 vé'],
    imageLabel: 'VÉ VIP',
  },
  {
    id: 'belt',
    category: 'Đai',
    name: 'Đai tím Premium',
    subtitle: 'Lõi cotton, 8 đường chỉ',
    price: 420_000,
    sizes: ['A1', 'A2', 'A3'],
    imageLabel: 'ẢNH ĐAI TÍM',
  },
  {
    id: 'ear',
    category: 'Phụ kiện',
    name: 'Bảo vệ tai thi đấu',
    subtitle: 'Khung mềm · Quai dán',
    price: 350_000,
    sizes: ['Một cỡ'],
    imageLabel: 'ẢNH BẢO VỆ TAI',
  },
  {
    id: 'bag',
    category: 'Phụ kiện',
    name: 'Túi lưới đựng gi',
    subtitle: 'Thoáng khí · 45 L',
    price: 290_000,
    sizes: ['Một cỡ'],
    imageLabel: 'ẢNH TÚI LƯỚI',
  },
];

/** The limited-edition product promoted by the drop card. */
export const DROP_PRODUCT_ID = 'gi-pro';

export const DROP_CAPTION = 'Pearl weave 450 gsm, thêu tay cổ áo';

/** Cart contents when the screen opens. */
export const INITIAL_CART = [{ productId: 'rash', size: 'M', quantity: 1 }];

export const FREE_SHIPPING_FROM = 1_000_000;
export const SHIPPING_FEE = 30_000;
export const MAX_LINE_QUANTITY = 9;

export const MOCK_ORDER_CODE = '#JJ-2026-0142';
export const MOCK_DELIVERY_WINDOW = '14/10 – 16/10';
export const MOCK_CHECKOUT_MS = 1300;
