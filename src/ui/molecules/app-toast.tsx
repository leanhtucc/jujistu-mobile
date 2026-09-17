import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '../atoms/icon';
import { resolveToastColors, toastTheme } from './toast-theme';
import type { ToastProps } from './toast.types';

export function AppToast({
  message,
  title,
  status = 'neutral',
  styleVariant = 'style1',
  visible = true,
  icon,
  accessibilityLabel,
  style,
  testID,
}: ToastProps) {
  if (!visible) {
    return null;
  }

  const colors = resolveToastColors(status, styleVariant);
  const hasTitle = Boolean(title && title.trim().length > 0);
  const hasStackedContent = hasTitle && Boolean(message);
  const resolvedAccessibilityLabel =
    accessibilityLabel ?? (hasTitle ? `${title}. ${message}` : message);

  return (
    <View
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.container,
        hasStackedContent ? styles.alignStart : styles.alignCenter,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: colors.borderWidth ?? 0,
        },
        style,
      ]}
      testID={testID}
    >
      {icon ? (
        <View style={styles.iconSlot}>
          <AppIcon
            accessible={false}
            color={colors.iconColor}
            name={icon}
            size={20}
          />
        </View>
      ) : null}

      <View style={styles.content}>
        {hasTitle ? (
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: colors.titleColor,
                fontFamily: toastTheme.titleFontFamily,
              },
            ]}
          >
            {title}
          </Text>
        ) : null}
        <Text
          numberOfLines={3}
          style={[
            styles.message,
            {
              color: colors.textColor,
              fontFamily: toastTheme.messageFontFamily,
            },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: toastTheme.borderRadius,
    flexDirection: 'row',
    gap: toastTheme.gap,
    maxWidth: 400,
    minHeight: 44,
    overflow: 'hidden',
    paddingHorizontal: toastTheme.paddingHorizontal,
    paddingVertical: toastTheme.paddingVertical,
    width: '100%',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    height: 20,
    width: 20,
  },
  content: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
