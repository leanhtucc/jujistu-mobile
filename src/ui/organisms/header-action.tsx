import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { semanticColors } from '@jujistu/shared/theme';

import { AppIcon } from '../atoms/icon';
import type { IconName } from '../atoms/icon';
import {
  HEADER_ACTION_GRADIENT,
  HEADER_ACTION_INSIDE_STROKE,
  HEADER_ACTION_THEME,
  resolveHeaderIconSize,
} from './header-theme';

export interface HeaderActionProps {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  iconSize?: number;
}

const HEADER_ACTION_GRADIENT_ID = 'header-action-gradient';

export function HeaderActionGradientSurface() {
  const { width, height } = HEADER_ACTION_THEME;
  const { strokeWidth, inset, innerRadius } = HEADER_ACTION_INSIDE_STROKE;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <SvgLinearGradient
          id={HEADER_ACTION_GRADIENT_ID}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
          gradientTransform={[...HEADER_ACTION_GRADIENT.transform]}
        >
          {HEADER_ACTION_GRADIENT.stops.map(stop => (
            <Stop
              key={stop.offset}
              offset={stop.offset}
              stopColor="#FFFFFF"
              stopOpacity={stop.opacity}
            />
          ))}
        </SvgLinearGradient>
      </Defs>
      <Rect
        x={inset}
        y={inset}
        width={width - strokeWidth}
        height={height - strokeWidth}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#${HEADER_ACTION_GRADIENT_ID})`}
        stroke={`url(#${HEADER_ACTION_GRADIENT_ID})`}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

export function HeaderActionComponent({
  icon,
  onPress,
  accessibilityLabel,
  iconSize,
}: HeaderActionProps) {
  const resolvedSize = iconSize ?? resolveHeaderIconSize(icon);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.actionPressable}
    >
      <HeaderActionGradientSurface />
      <AppIcon
        name={icon}
        size={resolvedSize}
        color={semanticColors.icon.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionPressable: {
    width: HEADER_ACTION_THEME.width,
    height: HEADER_ACTION_THEME.height,
    borderRadius: HEADER_ACTION_THEME.borderRadius,
    padding: HEADER_ACTION_THEME.padding,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
