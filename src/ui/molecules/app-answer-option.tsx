import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { opacity as opacityTokens, spacing } from '@jujistu/shared/theme';

import { AppIcon } from '../atoms/icon';
import {
  answerOptionSizeRecipes,
  resolveAnswerOptionColors,
  resolveAnswerOptionEffectiveState,
} from './answer-option-theme';
import type { AnswerOptionProps } from './answer-option.types';

const IMAGE_MAX_SIZE = 140;

export function AppAnswerOption({
  label,
  onPress,
  size = 'large',
  state,
  selected = false,
  disabled = false,
  icon,
  imageSource,
  imageAccessibilityLabel,
  alignText = 'center',
  numberOfLines,
  opacity,
  accessibilityLabel,
  style,
  testID,
}: AnswerOptionProps) {
  const [isPressed, setIsPressed] = useState(false);
  const effectiveState = resolveAnswerOptionEffectiveState({
    state,
    selected,
    disabled,
  });
  const isDisabled = effectiveState === 'disabled';
  const isSelected =
    selected ||
    effectiveState === 'selected' ||
    effectiveState === 'focus' ||
    effectiveState === 'success';
  const isInteractive = Boolean(onPress) && !isDisabled;

  const sizeRecipe = answerOptionSizeRecipes[size];
  const colors = resolveAnswerOptionColors(effectiveState);

  const hasImage = Boolean(imageSource);
  const hasLabel = label.trim().length > 0;
  const resolvedAlignText = hasImage ? 'center' : alignText;

  const resolvedOpacity =
    opacity ?? (isDisabled ? opacityTokens.disabled : isPressed ? 0.85 : 1);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        selected: isSelected,
      }}
      disabled={!isInteractive}
      hitSlop={4}
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
          minHeight: hasImage ? undefined : sizeRecipe.minHeight,
          borderRadius: sizeRecipe.borderRadius,
          borderWidth: sizeRecipe.borderWidth,
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          opacity: resolvedOpacity,
          paddingHorizontal: hasImage
            ? spacing[6]
            : sizeRecipe.paddingHorizontal,
          paddingTop: hasImage ? spacing[6] : sizeRecipe.paddingTop,
          paddingBottom: hasImage ? spacing[6] : sizeRecipe.paddingBottom,
        },
        style,
      ]}
      testID={testID}
    >
      {hasImage ? (
        <View style={styles.imageLayout}>
          <Image
            accessibilityLabel={imageAccessibilityLabel}
            accessible={Boolean(imageAccessibilityLabel)}
            resizeMode="contain"
            source={imageSource!}
            style={styles.image}
          />
          {hasLabel ? (
            <Text
              numberOfLines={numberOfLines}
              style={[
                styles.imageLabel,
                {
                  color: colors.contentColor,
                  fontFamily: sizeRecipe.fontFamily,
                  fontSize: sizeRecipe.fontSize,
                  lineHeight: sizeRecipe.lineHeight,
                },
              ]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      ) : (
        <View
          style={[
            styles.textRow,
            resolvedAlignText === 'left'
              ? styles.justifyStart
              : styles.justifyCenter,
          ]}
        >
          {icon ? (
            <View style={styles.iconContainer}>
              <AppIcon
                accessible={false}
                color={colors.contentColor}
                name={icon}
                size={sizeRecipe.iconSize}
              />
            </View>
          ) : null}

          {hasLabel ? (
            <Text
              numberOfLines={numberOfLines}
              style={[
                styles.labelText,
                {
                  color: colors.contentColor,
                  fontFamily: sizeRecipe.fontFamily,
                  fontSize: sizeRecipe.fontSize,
                  lineHeight: sizeRecipe.lineHeight,
                  textAlign: resolvedAlignText,
                },
              ]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  imageLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    alignSelf: 'center',
    height: IMAGE_MAX_SIZE,
    maxHeight: IMAGE_MAX_SIZE,
    maxWidth: IMAGE_MAX_SIZE,
    width: IMAGE_MAX_SIZE,
  },
  imageLabel: {
    marginTop: spacing[3],
    textAlign: 'center',
  },
  textRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    overflow: 'hidden',
    width: '100%',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labelText: {
    flexShrink: 1,
  },
});
