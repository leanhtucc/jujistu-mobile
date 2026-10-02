import { semanticColors, typography } from '@jujistu/shared/theme';
import { AppIcon, AppIconButton } from '@jujistu/ui';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export interface VideoSearchHeaderProps {
  readonly onBack: () => void;
  readonly onChangeText: (value: string) => void;
  readonly value: string;
}

export function VideoSearchHeader({
  onBack,
  onChangeText,
  value,
}: VideoSearchHeaderProps) {
  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <View style={styles.container}>
      <AppIconButton
        accessibilityLabel="Đóng tìm kiếm"
        appearance="soft"
        icon="chevronLeft"
        onPress={onBack}
        size="sm"
        variant="secondaryDark"
      />
      <View style={styles.inputSurface}>
        <AppIcon color={semanticColors.icon.tertiary} name="search" size={20} />
        <TextInput
          accessibilityLabel="Tìm video nổi bật"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          placeholder="Tìm video"
          placeholderTextColor={semanticColors.text.tertiary}
          ref={inputRef}
          returnKeyType="search"
          selectionColor={semanticColors.action.primary}
          style={styles.input}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: semanticColors.background.canvas,
  },
  inputSurface: {
    height: 40,
    flex: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: semanticColors.border.strong,
    borderRadius: 4,
    backgroundColor: semanticColors.background.surfaceSubtle,
  },
  input: {
    ...typography.body.md,
    flex: 1,
    padding: 0,
    color: semanticColors.text.primary,
  },
});
