import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import {
  AppBottomSheet,
  AppButton,
  AppIcon,
  AppQuantityStepper,
  AppStampIn,
} from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MOCK_DELIVERY_WINDOW, MOCK_ORDER_CODE } from '../data/shop-content';
import { formatVnd } from '../data/shop-selectors';
import type {
  CartLineModel,
  CartTotals,
  CheckoutStatus,
} from '../types/shop.types';

export interface ShopCartSheetProps {
  readonly visible: boolean;
  readonly lines: readonly CartLineModel[];
  readonly totals: CartTotals;
  readonly itemCount: number;
  readonly status: CheckoutStatus;
  readonly onClose: () => void;
  readonly onChangeLine: (index: number, delta: number) => void;
  readonly onCheckout: () => void;
  readonly onFinish: () => void;
}

export function ShopCartSheet({
  visible,
  lines,
  totals,
  itemCount,
  status,
  onClose,
  onChangeLine,
  onCheckout,
  onFinish,
}: ShopCartSheetProps) {
  const done = status === 'done';

  return (
    <AppBottomSheet
      onClose={onClose}
      testID="shop-cart-sheet"
      title={done ? 'Đặt hàng thành công' : `Giỏ hàng · ${itemCount} món`}
      visible={visible}
    >
      {done ? (
        <View style={styles.done} testID="shop-order-done">
          <AppStampIn>
            <View style={styles.stamp}>
              <Text style={styles.stampText}>ĐÃ ĐẶT</Text>
            </View>
          </AppStampIn>
          <Text style={styles.orderCode}>Đơn {MOCK_ORDER_CODE}</Text>
          <Text style={styles.orderNote}>
            Dự kiến giao {MOCK_DELIVERY_WINDOW}. Vé điện tử được gửi vào mục Vé
            của bạn.
          </Text>
          <AppButton
            appearance="soft"
            label="Tiếp tục mua sắm"
            onPress={onFinish}
            size="lg"
            variant="secondaryDark"
          />
        </View>
      ) : lines.length === 0 ? (
        <View style={styles.empty} testID="shop-cart-empty">
          <AppIcon
            accessible={false}
            color={semanticColors.icon.tertiary}
            name="shoppingBag"
            size={32}
          />
          <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.lines}>
            {lines.map((line, index) => (
              <View
                key={`${line.productId}-${line.size}`}
                style={styles.line}
                testID={`shop-cart-line-${line.productId}`}
              >
                <View style={styles.thumb} />
                <View style={styles.lineText}>
                  <Text style={styles.lineName}>{line.product.name}</Text>
                  <Text style={styles.lineMeta}>
                    Cỡ {line.size} · {formatVnd(line.product.price)}
                  </Text>
                </View>
                <AppQuantityStepper
                  decrementLabel={
                    line.quantity > 1
                      ? `Giảm số lượng ${line.product.name}`
                      : `Xoá ${line.product.name} khỏi giỏ`
                  }
                  incrementLabel={`Tăng số lượng ${line.product.name}`}
                  onDecrement={() => onChangeLine(index, -1)}
                  onIncrement={() => onChangeLine(index, 1)}
                  size="sm"
                  testID={`shop-cart-qty-${line.productId}`}
                  value={line.quantity}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tạm tính</Text>
              <Text style={styles.totalValue}>
                {formatVnd(totals.subtotal)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Vận chuyển</Text>
              <Text style={styles.totalValue}>
                {totals.shipping > 0 ? formatVnd(totals.shipping) : 'Miễn phí'}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.grand]}>
              <Text style={styles.grandLabel}>Tổng cộng</Text>
              <Text style={styles.grandValue} testID="shop-cart-total">
                {formatVnd(totals.total)}
              </Text>
            </View>
          </View>
          <AppButton
            disabled={status === 'paying'}
            beltTip
            label={
              status === 'paying'
                ? 'Đang xử lý…'
                : `Thanh toán · ${formatVnd(totals.total)}`
            }
            onPress={onCheckout}
            size="lg"
          />
        </View>
      )}
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14 },
  lines: { maxHeight: 280 },
  line: {
    alignItems: 'center',
    borderBottomColor: semanticColors.stitch.color,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  thumb: {
    backgroundColor: semanticColors.background.surfaceElevated,
    borderRadius: 10,
    height: 56,
    width: 56,
  },
  lineText: { flex: 1, minWidth: 0 },
  lineName: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  lineMeta: { ...dsTypography.counter, color: semanticColors.text.tertiary },
  totals: { gap: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  totalValue: { ...dsTypography.counter, color: semanticColors.text.primary },
  grand: { alignItems: 'baseline', paddingTop: 6 },
  grandLabel: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
  },
  grandValue: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 20,
    lineHeight: 22,
  },
  empty: { alignItems: 'center', gap: 12, paddingBottom: 8, paddingTop: 28 },
  emptyText: { ...dsTypography.body, color: semanticColors.text.secondary },
  done: { alignItems: 'center', gap: 14, paddingBottom: 4, paddingTop: 8 },
  stamp: {
    alignItems: 'center',
    borderColor: semanticColors.action.primary,
    borderRadius: 18,
    borderWidth: 3,
    height: 104,
    justifyContent: 'center',
    transform: [{ rotate: '-7deg' }],
    width: 104,
  },
  stampText: {
    ...dsTypography.counter,
    color: semanticColors.action.primary,
    fontSize: 11,
    letterSpacing: 1.3,
  },
  orderCode: { ...dsTypography.title, color: semanticColors.text.primary },
  orderNote: {
    ...dsTypography.body,
    alignSelf: 'stretch',
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
