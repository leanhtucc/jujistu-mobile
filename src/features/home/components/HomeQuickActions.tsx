import { useResponsive } from '@jujistu/shared/constants/responsive';
import {
  radius,
  semanticColors,
  semanticGradients,
  typography,
} from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import {
  getHomeQuickActions,
  type HomeMode,
  type HomeQuickAction,
} from '../data/home-content';

const FIGMA_ITEM_WIDTH = 104;
const MIN_COLUMN_GAP = 8;
const ROW_GAP = 15;
const QUICK_ACTION_GRADIENT_ID = 'home-quick-action-gradient';

export interface HomeQuickActionsProps {
  readonly mode?: HomeMode;
  readonly onPressAction?: (action: HomeQuickAction) => void;
}

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

function QuickActionBackground() {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient
          id={QUICK_ACTION_GRADIENT_ID}
          x1="50%"
          x2="50%"
          y1="100%"
          y2="0%"
        >
          <Stop
            offset="0"
            stopColor={semanticGradients.surface.quickAction.start}
          />
          <Stop
            offset="1"
            stopColor={semanticGradients.surface.quickAction.end}
          />
        </LinearGradient>
      </Defs>
      <Rect
        fill={`url(#${QUICK_ACTION_GRADIENT_ID})`}
        height="100%"
        rx={radius.md}
        width="100%"
      />
    </Svg>
  );
}

function QuickActionItem({
  action,
  height,
  scale,
  onPress,
  width,
}: {
  readonly action: HomeQuickAction;
  readonly height: number;
  readonly scale: number;
  readonly onPress?: (action: HomeQuickAction) => void;
  readonly width: number;
}) {
  return (
    <Pressable
      accessibilityLabel={action.label}
      accessibilityRole="button"
      disabled={!onPress}
      hitSlop={4}
      onPress={onPress ? () => onPress(action) : undefined}
      style={[styles.item, { height, width }]}
    >
      <QuickActionBackground />
      <AppIcon
        accessible={false}
        name={action.iconName}
        size={action.iconSize * scale}
      />
      <Text
        numberOfLines={
          action.key === 'leaderboard' || action.key === 'mma-academy' ? 2 : 1
        }
        style={[
          styles.label,
          action.key === 'leaderboard' || action.key === 'mma-academy'
            ? styles.compactLabel
            : undefined,
          {
            fontSize:
              (action.key === 'leaderboard' || action.key === 'mma-academy'
                ? 10.5
                : (typography.label.sm.fontSize as number)) * scale,
            lineHeight:
              (action.key === 'leaderboard' || action.key === 'mma-academy'
                ? 14
                : (typography.label.sm.lineHeight as number)) * scale,
          },
        ]}
      >
        {action.label}
      </Text>
    </Pressable>
  );
}

export function HomeQuickActions({
  mode = 'authenticated',
  onPressAction,
}: HomeQuickActionsProps) {
  const responsive = useResponsive();
  const actions = getHomeQuickActions(mode);
  const geometry = resolveHomeQuickActionGeometry(responsive.width);
  const contentScale = Math.min(1.5, geometry.itemWidth / FIGMA_ITEM_WIDTH);

  return (
    <View
      accessibilityLabel="Lối tắt Home"
      style={[
        styles.container,
        {
          columnGap: geometry.columnGap,
          rowGap: ROW_GAP * contentScale,
          width: geometry.gridWidth,
        },
      ]}
    >
      {actions.map((action, index) => (
        <QuickActionItem
          action={action}
          height={(index >= 3 ? 38 : 36) * contentScale}
          key={action.key}
          onPress={onPressAction}
          scale={contentScale}
          width={geometry.itemWidth}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    borderWidth: 1,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.md,
    overflow: 'hidden',
    paddingLeft: 8,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
  },
  label: {
    ...typography.label.sm,
    flexShrink: 1,
    color: semanticColors.text.primary,
    textAlign: 'center',
    textShadowColor: semanticColors.background.canvasDeep,
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 0.5,
  },
  compactLabel: {
    fontSize: 10.5,
    lineHeight: 14,
  },
});
