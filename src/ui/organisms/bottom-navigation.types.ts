import type { ImageSourcePropType } from 'react-native';

import type { IconName } from '../atoms/icon/icon.types';

/**
 * Verified PNG node-render image source with exact Figma logical render
 * dimensions. These describe the IMAGE rendered inside the fixed 36×36
 * icon slot — NOT the outer slot size.
 *
 * @deprecated Prefer BottomNavigationIconNameSource (SVG/AppIcon path).
 * Kept for backward compatibility during the PNG→SVG migration.
 */
export interface BottomNavigationImageSource {
  readonly source: ImageSourcePropType;
  /** Logical image render width (Figma node logical width). */
  readonly width: number;
  /** Logical image render height (Figma node logical height). */
  readonly height: number;
}

/**
 * SVG/AppIcon icon slot. Uses a registered IconName glyph rendered via
 * AppIcon inside the fixed 36×36 icon slot.
 *
 * `size` overrides the glyph size inside the slot (default: 28).
 * `color` overrides the glyph fill color for MONOCHROME_VECTOR glyphs.
 * FIXED_VISUAL glyphs (embedded rasters) ignore `color`.
 */
export interface BottomNavigationIconNameSource {
  readonly iconName: IconName;
  /** Rendered size in logical pixels inside the 36×36 slot. Default: 28. */
  readonly size?: number;
  /**
   * Fill color forwarded to MONOCHROME_VECTOR glyphs.
   * FIXED_VISUAL glyphs ignore this value.
   */
  readonly color?: string;
}

/**
 * Discriminated union: either a legacy PNG image slot or the new SVG/AppIcon slot.
 * Discriminated by the presence of `iconName` vs `source`.
 */
export type BottomNavigationIconSlot =
  | BottomNavigationImageSource
  | BottomNavigationIconNameSource;

/**
 * Data model for a single Bottom Navigation tab item.
 * Navigation-independent: no routes, screens, or components.
 */
export interface BottomNavigationItemData<Key extends string = string> {
  readonly key: Key;
  readonly label: string;
  readonly activeIcon: BottomNavigationIconSlot;
  readonly inactiveIcon: BottomNavigationIconSlot;
  /** Falls back to label when absent. */
  readonly accessibilityLabel?: string;
}

/**
 * Props for the controlled, data-driven AppBottomNavigation organism.
 */
export interface AppBottomNavigationProps<Key extends string = string> {
  readonly items: ReadonlyArray<BottomNavigationItemData<Key>>;
  readonly activeKey: Key;
  readonly onItemPress: (key: Key) => void;
}
