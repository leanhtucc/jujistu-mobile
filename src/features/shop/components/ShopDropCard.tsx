import {
  dsTypography,
  primitiveColors,
  radius,
  semanticColors,
} from '@jujistu/shared/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DROP_CAPTION } from '../data/shop-content';
import { formatVnd } from '../data/shop-selectors';
import type { Product } from '../types/shop.types';

export interface ShopDropCardProps {
  readonly product: Product;
  readonly onPress: (product: Product) => void;
}

/** Limited-edition card on gi-cotton, the only light surface in the app. */
export function ShopDropCard({ product, onPress }: ShopDropCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Bản giới hạn: ${product.name}, ${formatVnd(
        product.price,
      )}`}
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={styles.root}
      testID="shop-drop"
    >
      <View style={styles.body}>
        <View>
          <Text style={styles.overline}>DROP GIẢI QUỐC GIA 2026</Text>
          <Text style={styles.name}>Gi Sen Vàng Pro</Text>
          <Text style={styles.caption}>{DROP_CAPTION}</Text>
        </View>
        <View style={styles.prices}>
          <Text style={styles.price}>{formatVnd(product.price)}</Text>
          {product.oldPrice ? (
            <Text style={styles.oldPrice}>{formatVnd(product.oldPrice)}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.photo}>
        <Text style={styles.photoLabel}>{product.imageLabel}</Text>
      </View>
      <View style={styles.tape}>
        <Text style={styles.tapeText}>BẢN GIỚI HẠN</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.gi,
    borderRadius: radius.card,
    flexDirection: 'row',
    minHeight: 190,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 8,
    paddingTop: 20,
  },
  overline: { ...dsTypography.overline, color: primitiveColors.red[700] },
  name: {
    ...dsTypography.title,
    color: semanticColors.text.inverse,
    marginTop: 6,
  },
  caption: {
    ...dsTypography.body,
    color: primitiveColors.neutral[600],
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  prices: {
    alignItems: 'baseline',
    columnGap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  price: {
    ...dsTypography.counter,
    color: semanticColors.text.inverse,
    fontSize: 18,
    lineHeight: 20,
  },
  oldPrice: {
    ...dsTypography.counter,
    color: primitiveColors.neutral[550],
    textDecorationLine: 'line-through',
  },
  photo: {
    backgroundColor: primitiveColors.gi[300],
    justifyContent: 'flex-end',
    padding: 12,
    width: 128,
  },
  photoLabel: { ...dsTypography.overline, color: primitiveColors.neutral[600] },
  tape: {
    backgroundColor: primitiveColors.orange[300],
    left: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    top: -1,
    transform: [{ rotate: '-2deg' }],
  },
  tapeText: { ...dsTypography.overline, color: semanticColors.text.inverse },
});
