import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNavigationItem } from './bottom-navigation-item';
import { BOTTOM_NAV_THEME } from './bottom-navigation-theme';
import type {
  AppBottomNavigationProps,
  BottomNavigationItemData,
} from './bottom-navigation.types';

/**
 * AppBottomNavigation v1 (Organism)
 *
 * Controlled, data-driven Bottom Navigation bar.
 *
 * Architecture rules:
 * - PARENT_OWNS_SAFE_AREA: renders only the visual bar region (paddingBottom=0).
 *   The parent navigator/wrapper provides the bottom inset.
 * - Navigation-independent: no React Navigation imports; routing via onItemPress.
 * - Product-config-independent: does not import product navigation icon configs.
 * - NO_CUSTOM_PRESSED_VISUAL_IN_V1: no custom opacity/scale/ripple pressed state.
 *
 * Icon slot: every item reserves a fixed 36×36 slot regardless of active/inactive
 * image dimensions. The PNG image is centered inside the slot.
 *
 * Active label: SVG gradient text (#A70100 → #FE8B33, left-to-right) rendered via
 * react-native-svg — the established project gradient pattern, no new package.
 *
 * Canonical Figma: NwZDju5WlLK9Ltxd7nYLnt — 25063:61935 (Menu simple).
 */
export function AppBottomNavigation<Key extends string = string>({
  items,
  activeKey,
  onItemPress,
}: AppBottomNavigationProps<Key>) {
  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {items.map(item => (
        <BottomNavigationItem
          isActive={item.key === activeKey}
          item={item as BottomNavigationItemData<Key>}
          key={item.key}
          onPress={onItemPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BOTTOM_NAV_THEME.backgroundColor,
    borderTopColor: BOTTOM_NAV_THEME.topBorderColor,
    borderTopWidth: BOTTOM_NAV_THEME.topBorderWidth,
    flexDirection: 'row',
    gap: BOTTOM_NAV_THEME.itemGap,
    paddingBottom: BOTTOM_NAV_THEME.paddingBottom,
    paddingHorizontal: BOTTOM_NAV_THEME.paddingHorizontal,
    paddingTop: BOTTOM_NAV_THEME.paddingTop,
  },
});
