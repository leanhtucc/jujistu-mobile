import { semanticColors, typography } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_QUICK_ACTIONS, type HomeQuickAction } from '../data/home-content';

export interface HomeQuickActionsProps {
  readonly onPressAction?: (action: HomeQuickAction) => void;
}

function QuickActionItem({
  action,
  onPress,
}: {
  readonly action: HomeQuickAction;
  readonly onPress?: (action: HomeQuickAction) => void;
}) {
  const content = (
    <>
      <AppIcon name={action.icon} size={action.iconSize} />
      <Text numberOfLines={1} style={styles.label}>
        {action.label}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={styles.item}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(action)}
      style={styles.item}
    >
      {content}
    </Pressable>
  );
}

export function HomeQuickActions({ onPressAction }: HomeQuickActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        {HOME_QUICK_ACTIONS.left.map(action => (
          <QuickActionItem
            action={action}
            key={action.key}
            onPress={onPressAction}
          />
        ))}
      </View>

      <View style={styles.rightColumn}>
        {HOME_QUICK_ACTIONS.right.map(action => (
          <QuickActionItem
            action={action}
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
    height: 181,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: 72,
    height: 181,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightColumn: {
    width: 51,
    height: 181,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    ...typography.label.sm,
    color: semanticColors.text.primary,
    textAlign: 'center',
  },
});
