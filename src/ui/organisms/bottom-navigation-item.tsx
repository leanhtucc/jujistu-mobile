import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { AppIcon } from '../atoms/icon/app-icon';
import {
  BOTTOM_NAV_ACTIVE_LABEL_GRADIENT,
  BOTTOM_NAV_ICON_SLOT,
  BOTTOM_NAV_INACTIVE_LABEL_COLOR,
  BOTTOM_NAV_LABEL_STYLE,
} from './bottom-navigation-theme';
import type {
  BottomNavigationIconSlot,
  BottomNavigationItemData,
} from './bottom-navigation.types';

const GRADIENT_LABEL_HEIGHT = BOTTOM_NAV_LABEL_STYLE.lineHeight as number;

/** Default rendered size for AppIcon glyphs inside the 36×36 slot. */
const DEFAULT_ICON_NAME_SIZE = 28;

/** Type guard — resolves whether a slot is the new SVG/AppIcon variant. */
function isIconNameSlot(
  slot: BottomNavigationIconSlot,
): slot is import('./bottom-navigation.types').BottomNavigationIconNameSource {
  return 'iconName' in slot;
}

interface BottomNavigationLabelProps {
  label: string;
  isActive: boolean;
}

function BottomNavigationLabel({
  label,
  isActive,
}: BottomNavigationLabelProps) {
  const gradId = BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.id;

  return (
    <Svg
      height={GRADIENT_LABEL_HEIGHT}
      pointerEvents="none"
      style={styles.labelSvg}
      width="100%"
    >
      {isActive ? (
        <Defs>
          <LinearGradient
            id={gradId}
            x1={BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.x1}
            x2={BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.x2}
            y1={BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.y1}
            y2={BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.y2}
          >
            <Stop
              offset="0"
              stopColor={BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.colorLeft}
            />
            <Stop
              offset="1"
              stopColor={BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.colorRight}
            />
          </LinearGradient>
        </Defs>
      ) : null}
      <SvgText
        fill={isActive ? `url(#${gradId})` : BOTTOM_NAV_INACTIVE_LABEL_COLOR}
        fontFamily={BOTTOM_NAV_LABEL_STYLE.fontFamily}
        fontSize={BOTTOM_NAV_LABEL_STYLE.fontSize}
        fontWeight={BOTTOM_NAV_LABEL_STYLE.fontWeight}
        letterSpacing={BOTTOM_NAV_LABEL_STYLE.letterSpacing}
        textAnchor="middle"
        x="50%"
        y={BOTTOM_NAV_LABEL_STYLE.fontSize as number}
      >
        {label}
      </SvgText>
    </Svg>
  );
}

/** Renders the icon slot — either AppIcon (SVG) or legacy Image (PNG). */
function BottomNavigationIconSlotRenderer({
  slot,
}: {
  slot: BottomNavigationIconSlot;
}) {
  if (isIconNameSlot(slot)) {
    return (
      <AppIcon
        accessible={false}
        name={slot.iconName}
        size={slot.size ?? DEFAULT_ICON_NAME_SIZE}
        color={slot.color}
        style={styles.iconNameView}
      />
    );
  }

  // Legacy PNG path — preserved for any consumer still passing ImageSourcePropType.
  return (
    <Image
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      resizeMode="contain"
      source={slot.source}
      style={{ width: slot.width, height: slot.height }}
    />
  );
}

export interface BottomNavigationItemProps<Key extends string = string> {
  item: BottomNavigationItemData<Key>;
  isActive: boolean;
  onPress: (key: Key) => void;
}

export function BottomNavigationItem<Key extends string = string>({
  item,
  isActive,
  onPress,
}: BottomNavigationItemProps<Key>) {
  const iconSlot = isActive ? item.activeIcon : item.inactiveIcon;
  const a11yLabel = item.accessibilityLabel ?? item.label;

  return (
    <Pressable
      accessibilityLabel={a11yLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      onPress={() => onPress(item.key)}
      style={styles.item}
    >
      {/* Fixed 36×36 icon slot — centers icon and prevents layout shifts */}
      <View style={styles.iconSlot}>
        <BottomNavigationIconSlotRenderer slot={iconSlot} />
      </View>

      {/* Tab label */}
      <BottomNavigationLabel isActive={isActive} label={item.label} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconSlot: {
    alignItems: 'center',
    height: BOTTOM_NAV_ICON_SLOT.height,
    justifyContent: 'center',
    width: BOTTOM_NAV_ICON_SLOT.width,
  },
  iconNameView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  labelSvg: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
