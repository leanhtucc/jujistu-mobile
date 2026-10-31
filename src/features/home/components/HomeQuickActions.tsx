import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  HOME_SHORTCUTS,
  type HomeMode,
  type HomeQuickAction,
  type HomeShortcut,
} from '../data/home-content';

const FIGMA_ITEM_WIDTH = 104;
const MIN_COLUMN_GAP = 12;

export function resolveHomeQuickActionGeometry(windowWidth: number) {
  const gridWidth = Math.min(600, Math.max(0, windowWidth - 32));
  const columnGap = Math.min(
    24,
    Math.max(MIN_COLUMN_GAP, (gridWidth - FIGMA_ITEM_WIDTH * 3) / 2),
  );
  const itemWidth = (gridWidth - columnGap * 2) / 3;

  return {
    columnGap,
    gridWidth,
    itemWidth,
  } as const;
}

export interface HomeQuickActionsProps {
  readonly mode?: HomeMode;
  readonly shortcuts?: ReadonlyArray<HomeShortcut>;
  readonly onPressAction?: (shortcut: HomeShortcut) => void;
  readonly onPressLegacyAction?: (action: HomeQuickAction) => void;
}

export function HomeQuickActions({
  shortcuts = HOME_SHORTCUTS,
  onPressAction,
}: HomeQuickActionsProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.root}
    >
      {shortcuts.map(shortcut => (
        <Pressable
          accessibilityLabel={shortcut.label}
          accessibilityRole="button"
          key={shortcut.key}
          onPress={() => onPressAction?.(shortcut)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.iconContainer}>
            <AppIcon
              color={primitiveColors.orange[500]}
              name={shortcut.iconName}
              size={22}
            />
          </View>
          <Text numberOfLines={1} style={styles.label}>
            {shortcut.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 0,
    marginVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: primitiveColors.neutral[800],
    borderColor: primitiveColors.orange[500],
    transform: [{ scale: 0.94 }],
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: primitiveColors.neutral[0],
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
