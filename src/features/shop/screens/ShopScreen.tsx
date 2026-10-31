import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import {
  AppChip,
  AppHeader,
  AppIcon,
  AppIconButton,
  AppInputField,
  AppToast,
} from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShopCartSheet } from '../components/ShopCartSheet';
import { ShopDropCard } from '../components/ShopDropCard';
import { ShopProductCard } from '../components/ShopProductCard';
import { ShopProductSheet } from '../components/ShopProductSheet';
import { chunk } from '../data/shop-selectors';
import { useShop } from '../hooks/use-shop';

const CONTENT_MAX_WIDTH = 720;

export interface ShopScreenProps {
  readonly onBack?: () => void;
  /** Opens the ticket purchase flow, preselecting a stand. */
  readonly onOpenTicket?: (zone: 'vip' | 'a') => void;
}

export function ShopScreen({ onBack, onOpenTicket }: ShopScreenProps) {
  const insets = useSafeAreaInsets();
  const shop = useShop({ onOpenTicket });

  const rows = chunk(shop.products, 2);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {onBack ? (
        <AppHeader
          backAccessibilityLabel="Quay lại"
          onBackPress={onBack}
          title="Shop"
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID="shop-scroll"
      >
        <View style={styles.column}>
          <View style={[styles.gutter, styles.titleRow]}>
            <View style={styles.titleBlock}>
              <Text style={styles.overline}>ĐỒ THI ĐẤU · VÉ · PHỤ KIỆN</Text>
              <Text accessibilityRole="header" style={styles.title}>
                Shop
              </Text>
            </View>
            <View>
              <AppIconButton
                accessibilityLabel={`Giỏ hàng, ${shop.cartCount} món`}
                appearance="soft"
                icon="shoppingBag"
                onPress={shop.openCart}
                variant="secondaryDark"
              />
              {shop.cartCount > 0 ? (
                <View style={styles.badge} testID="shop-cart-badge">
                  <Text style={styles.badgeText}>{shop.cartCount}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.gutter}>
            <AppInputField
              accessibilityLabel="Tìm sản phẩm"
              autoCapitalize="none"
              leadingIcon="search"
              onChangeText={shop.setQuery}
              placeholder="Tìm gi, rashguard, đai…"
              size="md"
              value={shop.query}
            />
          </View>

          {shop.showDrop && shop.dropProduct ? (
            <View style={styles.gutter}>
              <ShopDropCard
                onPress={shop.openProduct}
                product={shop.dropProduct}
              />
            </View>
          ) : null}

          <ScrollView
            contentContainerStyle={styles.chips}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
          >
            {shop.categories.map(item => (
              <AppChip
                key={item}
                label={item}
                onPress={() => shop.selectCategory(item)}
                selected={item === shop.category}
                testID={`shop-category-${item}`}
              />
            ))}
          </ScrollView>

          {shop.products.length > 0 ? (
            <View style={[styles.gutter, styles.grid]}>
              {rows.map(row => (
                <View key={row[0].id} style={styles.gridRow}>
                  {row.map(product => (
                    <ShopProductCard
                      key={product.id}
                      onPress={shop.openProduct}
                      onQuickAdd={shop.quickAdd}
                      product={product}
                    />
                  ))}
                  {row.length === 1 ? <View style={styles.gridSpacer} /> : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.gutter}>
              <View style={styles.empty} testID="shop-empty">
                <AppIcon
                  accessible={false}
                  color={semanticColors.icon.tertiary}
                  name="search"
                  size={30}
                />
                <Text style={styles.emptyText}>
                  Không tìm thấy sản phẩm cho "{shop.query}"
                </Text>
                <Text
                  accessibilityRole="button"
                  onPress={shop.clearQuery}
                  style={styles.clear}
                >
                  Xoá tìm kiếm
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <ShopProductSheet
        onAdd={shop.addFromSheet}
        onChangeQuantity={shop.changeQuantity}
        onClose={shop.closeSheet}
        onSelectSize={shop.selectSize}
        sheet={shop.sheet}
      />
      <ShopCartSheet
        itemCount={shop.cartCount}
        lines={shop.cartLines}
        onChangeLine={shop.changeCartLine}
        onCheckout={shop.checkout}
        onClose={shop.closeCart}
        onFinish={shop.finishOrder}
        status={shop.checkoutStatus}
        totals={shop.totals}
        visible={shop.cartOpen}
      />

      {shop.toast ? (
        <View pointerEvents="none" style={styles.toast} testID="shop-toast">
          <AppToast
            message={shop.toast}
            status="neutral"
            styleVariant="style2"
            visible
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: semanticColors.background.canvas, flex: 1 },
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 10 },
  column: { gap: 20, maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  gutter: { paddingHorizontal: spacing.gutter },
  titleRow: { alignItems: 'flex-end', flexDirection: 'row', gap: 8 },
  titleBlock: { flex: 1, minWidth: 0 },
  overline: {
    ...dsTypography.overline,
    color: semanticColors.text.accent,
    marginBottom: 6,
  },
  title: { ...dsTypography.display, color: semanticColors.text.primary },
  badge: {
    alignItems: 'center',
    backgroundColor: semanticColors.action.primary,
    borderRadius: 9,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    paddingHorizontal: 5,
    position: 'absolute',
    right: -2,
    top: -2,
  },
  badgeText: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 11,
    lineHeight: 13,
  },
  chipScroll: { flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: spacing.gutter, paddingVertical: 2 },
  grid: { gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  gridSpacer: { flex: 1 },
  empty: {
    alignItems: 'center',
    borderColor: semanticColors.border.default,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    textAlign: 'center',
  },
  clear: { ...dsTypography.bodyStrong, color: semanticColors.text.accent },
  toast: {
    bottom: 16,
    left: spacing.gutter,
    position: 'absolute',
    right: spacing.gutter,
  },
});
