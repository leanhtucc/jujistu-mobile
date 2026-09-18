import { fontFamilies } from '@jujistu/shared/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const TITLE_GRADIENT_ID = 'app-gradient-title-fill';

const gradientStops = [
  ['0%', '#4D4D4D'],
  ['7.08%', '#535353'],
  ['20.26%', '#5F5F5F'],
  ['29.74%', '#9A9A9A'],
  ['33.25%', '#ACACAC'],
  ['39.1%', '#AEAEAE'],
  ['44.69%', '#636363'],
  ['49.88%', '#AFAFAF'],
  ['54.25%', '#808080'],
  ['59.24%', '#8B8B8B'],
  ['73.03%', '#757575'],
  ['79.97%', '#747474'],
  ['97.81%', '#454545'],
] as const;

export interface AppGradientTitleProps {
  label: string;
  accessibilityLabel?: string;
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  shadow?: boolean;
  strokeWidth?: number;
}

export function AppGradientTitle({
  label,
  accessibilityLabel,
  fontSize = 28,
  letterSpacing = -0.28,
  lineHeight = 35,
  shadow = true,
  strokeWidth = 1,
}: AppGradientTitleProps) {
  const height = lineHeight + (shadow ? 8 : 0);

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="header"
      style={[styles.container, { height }]}
    >
      <Svg
        accessible={false}
        height={height}
        pointerEvents="none"
        style={styles.svg}
        width="100%"
      >
        <Defs>
          <LinearGradient
            id={TITLE_GRADIENT_ID}
            x1="0%"
            x2="100%"
            y1="36.6%"
            y2="63.4%"
          >
            {gradientStops.map(([offset, color]) => (
              <Stop key={offset} offset={offset} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        {shadow ? (
          <SvgText
            alignmentBaseline="middle"
            fill="rgba(0, 0, 0, 0.35)"
            fontFamily={fontFamilies.display.regular}
            fontSize={fontSize}
            fontWeight="400"
            letterSpacing={letterSpacing}
            textAnchor="middle"
            x="50%"
            y={lineHeight / 2 + 2}
          >
            {label}
          </SvgText>
        ) : null}
        <SvgText
          alignmentBaseline="middle"
          fill={`url(#${TITLE_GRADIENT_ID})`}
          fontFamily={fontFamilies.display.regular}
          fontSize={fontSize}
          fontWeight="400"
          letterSpacing={letterSpacing}
          stroke={strokeWidth > 0 ? '#000000' : undefined}
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          textAnchor="middle"
          x="50%"
          y={lineHeight / 2}
        >
          {label}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  svg: {
    overflow: 'visible',
  },
});
