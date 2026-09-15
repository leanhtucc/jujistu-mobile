import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HeaderActionComponent } from './header-action';
import {
  HEADER_ACTION_THEME,
  HEADER_THEME,
  HEADER_TITLE_STYLE,
  resolveHeaderBackgroundColor,
  resolveHeaderIconSize,
} from './header-theme';
import type { HeaderProps } from './header.types';

/**
 * AppHeader v1 (Organism)
 *
 * Symmetrical 3-column navigation header:
 * [Leading Back Action: 40px] - [Gap: 12px] - [Center Title: flex 1] - [Gap: 12px] - [Trailing Action/Spacer: 40px]
 *
 * Architecture rules:
 * - PARENT_OWNS_SAFE_AREA: fixed visual height of 56px, top insets handled by parent.
 * - Navigation independent: callbacks injected via props, no router/navigation imports.
 * - Title remains perfectly centered whether trailing action is present or absent.
 */
export function AppHeader({
  title,
  onBackPress,
  backAccessibilityLabel,
  background = 'solid',
  trailingAction,
}: HeaderProps) {
  const backgroundColor = resolveHeaderBackgroundColor(background);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Leading Slot (Required Back Action) */}
      <HeaderActionComponent
        icon="chevronLeft"
        onPress={onBackPress}
        accessibilityLabel={backAccessibilityLabel}
        iconSize={24}
      />

      {/* Center Slot (Title constrained to maintain full symmetry) */}
      <View style={styles.titleContainer}>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={HEADER_TITLE_STYLE}
        >
          {title}
        </Text>
      </View>

      {/* Trailing Slot (Interactive Action or Noninteractive 40x40 Spacer) */}
      {trailingAction ? (
        <HeaderActionComponent
          icon={trailingAction.icon}
          onPress={trailingAction.onPress}
          accessibilityLabel={trailingAction.accessibilityLabel}
          iconSize={resolveHeaderIconSize(trailingAction.icon)}
        />
      ) : (
        <View
          style={styles.spacer}
          accessible={false}
          importantForAccessibility="no"
          accessibilityElementsHidden={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_THEME.height,
    paddingHorizontal: HEADER_THEME.paddingHorizontal,
    paddingVertical: HEADER_THEME.paddingVertical,
    gap: HEADER_THEME.gap,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: HEADER_THEME.borderRadius,
    borderWidth: 0,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: HEADER_ACTION_THEME.width,
    height: HEADER_ACTION_THEME.height,
  },
});
