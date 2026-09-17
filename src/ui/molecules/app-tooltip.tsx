import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import {
  getArrowSvgProps,
  getTooltipDirectionStyle,
  resolveTooltipColors,
  tooltipTheme,
} from './tooltip-theme';
import type { TooltipDirection, TooltipProps } from './tooltip.types';

function TooltipArrow({
  direction,
  color,
}: {
  direction: TooltipDirection;
  color: string;
}) {
  const svgProps = getArrowSvgProps(direction);

  return (
    <View pointerEvents="none" style={styles.arrowContainer}>
      <Svg
        height={svgProps.height}
        pointerEvents="none"
        viewBox={`0 0 ${svgProps.width} ${svgProps.height}`}
        width={svgProps.width}
      >
        <Polygon fill={color} points={svgProps.points} />
      </Svg>
    </View>
  );
}

export function AppTooltip({
  text,
  direction = 'bottom',
  styleVariant = 'solid',
  visible = true,
  numberOfLines = 2,
  children,
  bubbleStyle,
  textStyle,
  style,
  testID,
}: TooltipProps) {
  if (!visible) {
    return null;
  }

  const colors = resolveTooltipColors(styleVariant);
  const content = text ?? children;
  const directionStyle = getTooltipDirectionStyle(direction);

  return (
    <View
      accessibilityLabel={typeof content === 'string' ? content : undefined}
      style={[styles.wrapper, directionStyle, style]}
      testID={testID}
    >
      <TooltipArrow color={colors.backgroundColor} direction={direction} />
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
            borderWidth: colors.borderWidth ?? 0,
          },
          bubbleStyle,
        ]}
      >
        {typeof content === 'string' ? (
          <Text
            numberOfLines={numberOfLines}
            style={[
              styles.text,
              {
                color: colors.textColor,
                fontFamily: tooltipTheme.fontFamily,
              },
              textStyle,
            ]}
          >
            {content}
          </Text>
        ) : (
          content
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bubble: {
    borderRadius: tooltipTheme.borderRadius,
    maxWidth: 280,
    minHeight: 36,
    paddingHorizontal: tooltipTheme.paddingHorizontal,
    paddingVertical: tooltipTheme.paddingVertical,
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
});
