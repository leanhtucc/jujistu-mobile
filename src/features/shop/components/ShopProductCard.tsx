import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import { AppIconButton, AppTag } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatVnd } from '../data/shop-selectors';
import type { Product } from '../types/shop.types';

export interface ShopProductCardProps {
  readonly product: Product;
  readonly onPress: (product: Product) => void;
  readonly onQuickAdd: (product: Product) => void;
}

export function ShopProductCard({
  product,
  onPress,
  onQuickAdd,
}: ShopProductCardProps) {
  return (
    <View style={styles.root} testID={`shop-product-${product.id}`}>
      <Pressable
        accessibilityLabel={`${product.name}, ${formatVnd(product.price)}`}
        accessibilityRole="button"
        onPress={() => onPress(product)}
        style={styles.image}
        testID={`shop-product-open-${product.id}`}
      >
        <Text style={styles.imageLabel}>{product.imageLabel}</Text>
        {product.tag ? (
          <View style={styles.tag}>
            <AppTag label={product.tag} variant={product.tagVariant} />
          </View>
        ) : null}
      </Pressable>
      <View style={styles.body}>
        <Text onPress={() => onPress(product)} style={styles.name}>
          {product.name}
        </Text>
        <Text style={styles.subtitle}>{product.subtitle}</Text>
        <View style={styles.footer}>
          <View style={styles.prices}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.price}>
              {formatVnd(product.price)}
            </Text>
            {product.oldPrice ? (
              <Text style={styles.oldPrice}>{formatVnd(product.oldPrice)}</Text>
            ) : null}
          </View>
          <AppIconButton
            shape="pill"
            accessibilityLabel={`Thêm ${product.name} vào giỏ`}
            icon="plus"
            onPress={() => onQuickAdd(product)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.card,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    backgroundColor: semanticColors.background.surfaceSubtle,
    height: 150,
    justifyContent: 'flex-end',
    padding: 10,
  },
  imageLabel: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  tag: { left: 10, position: 'absolute', top: 10 },
  body: { flex: 1, gap: 4, padding: 12 },
  name: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  subtitle: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 8,
  },
  prices: { flexShrink: 1, gap: 3, minWidth: 0 },
  price: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 14,
  },
  oldPrice: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
});
