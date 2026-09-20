import { useResponsive } from '@jujistu/shared/constants/responsive';
import { semanticColors, typography } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  getHomeQuickActions,
  type HomeMode,
  type HomeQuickAction,
} from '../data/home-content';

export interface HomeQuickActionsProps {
  readonly mode?: HomeMode;
  readonly onPressAction?: (action: HomeQuickAction) => void;
}

function resolveActionIconSize(baseSize: number, isTablet: boolean): number {
  if (!isTablet) {
    return baseSize;
  }
  if (baseSize <= 34) {
    return 48;
  }
  if (baseSize <= 40) {
    return 54;
  }
  return 56;
}

function QuickActionItem({
  action,
  isTablet = false,
  onPress,
}: {
  readonly action: HomeQuickAction;
  readonly isTablet?: boolean;
  readonly onPress?: (action: HomeQuickAction) => void;
}) {
  const iconSize = resolveActionIconSize(action.iconSize, isTablet);
  const content = (
    <>
      <AppIcon name={action.icon} size={iconSize} />
      <Text
        numberOfLines={1}
        style={[styles.label, isTablet ? styles.tabletLabel : undefined]}
      >
        {action.label}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.item, isTablet ? styles.tabletItem : undefined]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(action)}
      style={[styles.item, isTablet ? styles.tabletItem : undefined]}
    >
      {content}
    </Pressable>
  );
}

export function HomeQuickActions({
  mode = 'authenticated',
  onPressAction,
}: HomeQuickActionsProps) {
  const responsive = useResponsive();
  const isTablet = responsive.isTablet;
  const actions = getHomeQuickActions(mode);

  return (
    <View
      style={[styles.container, isTablet ? styles.tabletContainer : undefined]}
    >
      <View
        style={[
          styles.leftColumn,
          isTablet ? styles.tabletLeftColumn : undefined,
        ]}
      >
        {actions.left.map(action => (
          <QuickActionItem
            action={action}
            isTablet={isTablet}
            key={action.key}
            onPress={onPressAction}
          />
        ))}
      </View>

      <View
        style={[
          styles.rightColumn,
          isTablet ? styles.tabletRightColumn : undefined,
        ]}
      >
        {actions.right.map(action => (
          <QuickActionItem
            action={action}
            isTablet={isTablet}
            key={action.key}
            onPress={onPressAction}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tabletContainer: {
    paddingHorizontal: 32,
  },
  leftColumn: {
    width: 72,
    alignItems: 'center',
    gap: 44,
  },
  tabletLeftColumn: {
    width: 96,
    gap: 52,
  },
  rightColumn: {
    width: 51,
    alignItems: 'center',
    gap: 44,
  },
  tabletRightColumn: {
    width: 72,
    gap: 52,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  tabletItem: {
    gap: 6,
  },
  label: {
    ...typography.label.sm,
    color: semanticColors.text.primary,
    textAlign: 'center',
  },
  tabletLabel: {
    fontFamily: typography.label.sm.fontFamily,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: typography.label.sm.fontWeight,
    color: semanticColors.text.primary,
    textAlign: 'center',
  },
});
