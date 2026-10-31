import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  dsTypography,
  primitiveColors,
  semanticColors,
} from '@jujistu/shared/theme';

import { AppBeltBar, type BeltRank } from './app-belt-bar';

export interface AvatarProps {
  readonly name: string;
  readonly source?: ImageSourcePropType;
  readonly size?: number;
  /** When set, a belt strap is drawn under the avatar. */
  readonly belt?: BeltRank;
  readonly degrees?: number;
  readonly testID?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AppAvatar({
  name,
  source,
  size = 48,
  belt,
  degrees = 0,
  testID = 'app-avatar',
}: AvatarProps) {
  return (
    <View
      accessibilityLabel={name}
      accessibilityRole="image"
      style={[styles.root, { width: size }]}
      testID={testID}
    >
      <View
        style={[
          styles.frame,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {source ? (
          <Image source={source} style={styles.image} />
        ) : (
          <Text style={[styles.initials, { fontSize: size * 0.34 }]}>
            {initialsOf(name)}
          </Text>
        )}
      </View>
      {belt ? (
        <AppBeltBar
          belt={belt}
          degrees={degrees}
          height={6}
          style={styles.belt}
          width={size * 0.7}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  frame: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surfaceElevated,
    borderColor: primitiveColors.alpha.white14,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { height: '100%', width: '100%' },
  initials: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.secondary,
  },
  belt: { marginTop: 4 },
});
