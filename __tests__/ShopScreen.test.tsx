import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShopScreen } from '@jujistu/features/shop';

import {
  addToCart,
  buildCartLines,
  changeLineQuantity,
  computeTotals,
  filterProducts,
  formatVnd,
} from '../src/features/shop/data/shop-selectors';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const mounted: ReactTestRenderer.ReactTestRenderer[] = [];

function render(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>{element}</SafeAreaProvider>,
    );
  });
  mounted.push(tree);
  return tree;
}

function has(tree: ReactTestRenderer.ReactTestRenderer, testID: string) {
  return tree.root.findAllByProps({ testID }).length > 0;
}

function press(tree: ReactTestRenderer.ReactTestRenderer, testID: string) {
  act(() => {
    tree.root.findAllByProps({ testID })[0].props.onPress();
  });
}

function badge(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByProps({ testID: 'shop-cart-badge' }).findByType(Text)
    .props.children;
}

function pressableByText(
  tree: ReactTestRenderer.ReactTestRenderer,
  prefix: string,
  predicate: (node: ReactTestRenderer.ReactTestInstance) => boolean,
) {
  const text = tree.root.findAll(
    node =>
      typeof node.props.children === 'string' &&
      node.props.children.startsWith(prefix),
  )[0];
  let node: ReactTestRenderer.ReactTestInstance | null = text ?? null;
  while (node && !predicate(node)) {
    node = node.parent;
  }
  return node;
}

function pressText(tree: ReactTestRenderer.ReactTestRenderer, prefix: string) {
  const node = pressableByText(
    tree,
    prefix,
    candidate => typeof candidate.props.onPress === 'function',
  );
  expect(node).not.toBeNull();
  act(() => {
    node?.props.onPress();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
  jest.useRealTimers();
});

describe('shop selectors', () => {
  it('formats prices in dong', () => {
    expect(formatVnd(2450000)).toBe('2.450.000₫');
    expect(formatVnd(690000)).toBe('690.000₫');
  });

  it('filters by category and diacritic-free search', () => {
    expect(filterProducts('Vé', '').map(p => p.id)).toEqual([
      'tk-std',
      'tk-vip',
    ]);
    expect(filterProducts('Tất cả', 'dai tim').map(p => p.id)).toEqual([
      'belt',
    ]);
    expect(filterProducts('Gi', 'rashguard')).toHaveLength(0);
  });

  it('merges identical lines and removes a line that reaches zero', () => {
    const merged = addToCart([{ productId: 'rash', size: 'M', quantity: 1 }], {
      productId: 'rash',
      size: 'M',
      quantity: 2,
    });
    expect(merged).toEqual([{ productId: 'rash', size: 'M', quantity: 3 }]);
    expect(
      addToCart(merged, { productId: 'rash', size: 'L', quantity: 1 }),
    ).toHaveLength(2);
    expect(changeLineQuantity(merged, 0, -3)).toEqual([]);
  });

  it('charges shipping under one million dong and none above', () => {
    const small = computeTotals(
      buildCartLines([{ productId: 'rash', size: 'M', quantity: 1 }]),
    );
    expect(small).toEqual({ subtotal: 690000, shipping: 30000, total: 720000 });

    const large = computeTotals(
      buildCartLines([{ productId: 'gi-pro', size: 'A2', quantity: 1 }]),
    );
    expect(large.shipping).toBe(0);
    expect(computeTotals([]).total).toBe(0);
  });
});

describe('ShopScreen', () => {
  it('shows the drop card, categories and products', () => {
    const tree = render(<ShopScreen />);
    expect(has(tree, 'shop-drop')).toBe(true);
    expect(has(tree, 'shop-product-gi-pro')).toBe(true);
    expect(badge(tree)).toBe(1);
  });

  it('filters by category and hides the drop card', () => {
    const tree = render(<ShopScreen />);
    press(tree, 'shop-category-Đai');
    expect(has(tree, 'shop-drop')).toBe(false);
    expect(has(tree, 'shop-product-belt')).toBe(true);
    expect(has(tree, 'shop-product-gi-pro')).toBe(false);
  });

  it('shows the empty state for an unmatched search', () => {
    const tree = render(<ShopScreen />);
    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Tìm sản phẩm' })
        .props.onChangeText('zzz');
    });
    expect(has(tree, 'shop-empty')).toBe(true);
  });

  it('adds a single-size product straight to the cart', () => {
    const tree = render(<ShopScreen />);
    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Thêm Bảo vệ tai thi đấu vào giỏ' })
        .props.onPress();
    });
    expect(badge(tree)).toBe(2);
    expect(has(tree, 'shop-toast')).toBe(true);
  });

  it('opens the sheet for a sized product and adds the chosen options', () => {
    const tree = render(<ShopScreen />);
    press(tree, 'shop-product-open-gi-lite');
    expect(has(tree, 'shop-product-sheet')).toBe(true);

    press(tree, 'shop-size-A3');
    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Tăng số lượng' })
        .props.onPress();
    });
    pressText(tree, 'Thêm vào giỏ');
    // 1 existing + 2 added.
    expect(badge(tree)).toBe(3);
  });

  it('opens the ticket flow for ticket products', () => {
    const onOpenTicket = jest.fn();
    const tree = render(<ShopScreen onOpenTicket={onOpenTicket} />);
    press(tree, 'shop-category-Vé');
    press(tree, 'shop-product-open-tk-vip');
    press(tree, 'shop-product-open-tk-std');
    expect(onOpenTicket.mock.calls).toEqual([['vip'], ['a']]);
  });

  it('checks out the cart and finishes the order', () => {
    const tree = render(<ShopScreen />);
    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Giỏ hàng, 1 món' })
        .props.onPress();
    });
    expect(has(tree, 'shop-cart-line-rash')).toBe(true);
    expect(
      tree.root.findByProps({ testID: 'shop-cart-total' }).props.children,
    ).toBe('720.000₫');

    pressText(tree, 'Thanh toán');
    act(() => {
      jest.advanceTimersByTime(1400);
    });
    expect(has(tree, 'shop-order-done')).toBe(true);

    pressText(tree, 'Tiếp tục mua sắm');
    expect(has(tree, 'shop-cart-badge')).toBe(false);
  });

  it('removes the only unit of a line from the cart', () => {
    const tree = render(<ShopScreen />);
    act(() => {
      tree.root
        .findByProps({ accessibilityLabel: 'Giỏ hàng, 1 món' })
        .props.onPress();
    });
    act(() => {
      tree.root
        .findByProps({
          accessibilityLabel: 'Xoá Rashguard Giải Quốc gia 2026 khỏi giỏ',
        })
        .props.onPress();
    });
    expect(has(tree, 'shop-cart-empty')).toBe(true);
  });
});
