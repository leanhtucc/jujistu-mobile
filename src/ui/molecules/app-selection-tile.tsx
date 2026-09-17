import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  opacity as opacityTokens,
  radius,
  spacing,
  typography,
} from '@jujistu/shared/theme';

import { AppCheckbox } from '../atoms/app-checkbox';
import { AppIcon } from '../atoms/icon';
import {
  resolveSelectionTileColors,
  resolveSelectionTileEffectiveState,
  resolveSelectionTileTitleStyle,
  SELECTION_TILE_THEME,
} from './selection-tile-theme';
import type { SelectionTileProps } from './selection-tile.types';

export function AppSelectionTile({
  title,
  description,
  badge,
  info,
  checked,
  selected,
  state,
  titleWeight = 'medium',
  icon,
  image,
  showTrailingIcon = false,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: SelectionTileProps) {
  const [isPressed, setIsPressed] = useState(false);
  const effectiveState = resolveSelectionTileEffectiveState({
    state,
    checked,
    selected,
    disabled,
  });
  const isDisabled = effectiveState === 'disabled';
  const isChecked =
    checked ??
    selected ??
    (effectiveState === 'selected' || effectiveState === 'focus');
  const hasPressHandler = Boolean(onPress);
  const isInteractive = hasPressHandler && !isDisabled;

  const colors = resolveSelectionTileColors(effectiveState);
  const titleStyle = resolveSelectionTileTitleStyle(titleWeight);

  const resolvedOpacity = isDisabled
    ? opacityTokens.disabled
    : isPressed
    ? 0.85
    : 1;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole={hasPressHandler ? 'button' : undefined}
      accessibilityState={{
        checked: showTrailingIcon ? isChecked : undefined,
        disabled: isDisabled,
        selected: isChecked,
      }}
      disabled={!isInteractive}
      onPress={isInteractive ? onPress : undefined}
      onPressIn={() => {
        if (isInteractive) {
          setIsPressed(true);
        }
      }}
      onPressOut={() => {
        if (isInteractive) {
          setIsPressed(false);
        }
      }}
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
          opacity: resolvedOpacity,
        },
        style,
      ]}
      testID={testID}
    >
      {icon ? (
        <View style={styles.leadingContainer}>
          <AppIcon
            accessible={false}
            color={colors.titleText}
            name={icon}
            size={24}
          />
        </View>
      ) : image ? (
        <View style={styles.leadingContainer}>
          <Image
            resizeMode="contain"
            source={image}
            style={styles.leadingImage}
          />
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleGroup}>
            <Text
              numberOfLines={1}
              style={[titleStyle, { color: colors.titleText }]}
            >
              {title}
            </Text>
            {badge ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.badgeBackground },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.badgeText, { color: colors.badgeText }]}
                >
                  {badge}
                </Text>
              </View>
            ) : null}
          </View>

          {info ? (
            <Text
              numberOfLines={1}
              style={[styles.infoText, { color: colors.helperText }]}
            >
              {info}
            </Text>
          ) : null}
        </View>

        {description ? (
          <Text
            numberOfLines={2}
            style={[styles.descriptionText, { color: colors.helperText }]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {showTrailingIcon ? (
        <View pointerEvents="none" style={styles.trailingContainer}>
          <AppCheckbox
            checked={isChecked}
            disabled={isDisabled}
            onValueChange={() => {}}
            size="sm"
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: SELECTION_TILE_THEME.borderRadius,
    borderWidth: SELECTION_TILE_THEME.borderWidth,
    flexDirection: 'row',
    gap: SELECTION_TILE_THEME.gap,
    minHeight: SELECTION_TILE_THEME.minHeight,
    overflow: 'hidden',
    paddingLeft: SELECTION_TILE_THEME.paddingLeft,
    paddingRight: SELECTION_TILE_THEME.paddingRight,
    paddingVertical: SELECTION_TILE_THEME.paddingVertical,
    width: '100%',
  },
  leadingContainer: {
    alignItems: 'center',
    height: SELECTION_TILE_THEME.leadingSize,
    justifyContent: 'center',
    width: SELECTION_TILE_THEME.leadingSize,
    flexShrink: 0,
  },
  leadingImage: {
    borderRadius: radius.xs,
    height: SELECTION_TILE_THEME.leadingSize,
    width: SELECTION_TILE_THEME.leadingSize,
  },
  content: {
    flex: 1,
    gap: spacing[1],
    justifyContent: 'center',
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  titleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing[2],
    minWidth: 0,
  },
  badge: {
    borderRadius: radius.xs,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    flexShrink: 0,
  },
  badgeText: {
    ...typography.caption.xs,
    fontWeight: '500',
  },
  infoText: {
    ...typography.label.sm,
    flexShrink: 0,
    marginLeft: spacing[2],
  },
  descriptionText: {
    ...typography.body.sm,
  },
  trailingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
