import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import {
  AppBottomSheet,
  AppButton,
  AppChip,
  AppQuantityStepper,
} from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_LINE_QUANTITY } from '../data/shop-content';
import { formatVnd } from '../data/shop-selectors';
import type { ProductSheetState } from '../hooks/use-shop';

export interface ShopProductSheetProps {
  readonly sheet: ProductSheetState | null;
  readonly onClose: () => void;
  readonly onSelectSize: (size: string) => void;
  readonly onChangeQuantity: (delta: number) => void;
  readonly onAdd: () => void;
}

export function ShopProductSheet({
  sheet,
  onClose,
  onSelectSize,
  onChangeQuantity,
  onAdd,
}: ShopProductSheetProps) {
  return (
    <AppBottomSheet
      onClose={onClose}
      testID="shop-product-sheet"
      title={sheet?.product.name}
      visible={sheet !== null}
    >
      {sheet ? (
        <View style={styles.content}>
          <View style={styles.image}>
            <Text style={styles.imageLabel}>{sheet.product.imageLabel}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.subtitle}>{sheet.product.subtitle}</Text>
            <Text style={styles.price}>{formatVnd(sheet.product.price)}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.groupLabel}>CHỌN CỠ</Text>
            <View style={styles.sizes}>
              {sheet.product.sizes.map(size => (
                <AppChip
                  key={size}
                  label={size}
                  onPress={() => onSelectSize(size)}
                  selected={size === sheet.size}
                  testID={`shop-size-${size}`}
                />
              ))}
            </View>
          </View>
          <View style={styles.quantityRow}>
            <Text style={styles.groupLabel}>SỐ LƯỢNG</Text>
            <AppQuantityStepper
              decrementDisabled={sheet.quantity <= 1}
              decrementLabel="Giảm số lượng"
              incrementDisabled={sheet.quantity >= MAX_LINE_QUANTITY}
              incrementLabel="Tăng số lượng"
              onDecrement={() => onChangeQuantity(-1)}
              onIncrement={() => onChangeQuantity(1)}
              testID="shop-sheet-quantity"
              value={sheet.quantity}
            />
          </View>
          <AppButton
            beltTip
            icon="shoppingBag"
            iconPosition="trailing"
            label={`Thêm vào giỏ · ${formatVnd(sheet.total)}`}
            onPress={onAdd}
            size="lg"
          />
        </View>
      ) : null}
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  image: {
    backgroundColor: semanticColors.background.surfaceSubtle,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.md + 4,
    borderWidth: 1,
    height: 150,
    justifyContent: 'flex-end',
    padding: 12,
  },
  imageLabel: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  priceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  subtitle: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  price: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 18,
    lineHeight: 20,
  },
  group: { gap: 8 },
  groupLabel: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
