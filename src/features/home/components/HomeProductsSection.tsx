import { primitiveColors } from '@jujistu/shared/theme';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  HOME_FEATURED_PRODUCTS,
  type HomeProductHighlight,
} from '../data/home-content';

export interface HomeProductsSectionProps {
  readonly products?: ReadonlyArray<HomeProductHighlight>;
  readonly onOpenShop?: () => void;
  readonly onSelectProduct?: (product: HomeProductHighlight) => void;
}

export function HomeProductsSection({
  products = HOME_FEATURED_PRODUCTS,
  onOpenShop,
  onSelectProduct,
}: HomeProductsSectionProps) {
  const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  return (
    <View style={styles.root}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Từ Shop</Text>
        <Pressable
          accessibilityLabel="Xem tất cả sản phẩm"
          accessibilityRole="button"
          onPress={onOpenShop}
        >
          <Text style={styles.seeAllText}>XEM TẤT CẢ</Text>
        </Pressable>
      </View>

      {/* Horizontal Product List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {products.map(product => {
          const isDiscount = product.tag?.startsWith('-');
          const isNew = product.tag === 'MỚI';

          return (
            <Pressable
              accessibilityLabel={product.name}
              accessibilityRole="button"
              key={product.id}
              onPress={() => onSelectProduct?.(product)}
              style={({ pressed }) => [
                styles.productCard,
                pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
              ]}
            >
              {/* Image & Tag */}
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="cover"
                  source={product.image}
                  style={styles.productImage}
                />
                {product.tag ? (
                  <View
                    style={[
                      styles.tagBadge,
                      isDiscount
                        ? styles.tagDiscount
                        : isNew
                        ? styles.tagNew
                        : styles.tagNeutral,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        isDiscount && styles.tagDiscountText,
                      ]}
                    >
                      {product.tag}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Title & Price */}
              <View style={styles.infoContainer}>
                <Text numberOfLines={2} style={styles.productName}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>{vnd(product.price)}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllText: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  productCard: {
    width: 138,
    gap: 6,
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    height: 124,
    borderRadius: 12,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagDiscount: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 46, 0.4)',
  },
  tagDiscountText: {
    color: primitiveColors.orange[500],
  },
  tagNew: {
    backgroundColor: '#D42A1E',
  },
  tagNeutral: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tagText: {
    color: primitiveColors.neutral[0],
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoContainer: {
    gap: 4,
  },
  productName: {
    color: primitiveColors.neutral[0],
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
  },
  productPrice: {
    color: primitiveColors.neutral[0],
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
