import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  dsTypography,
  primitiveColors,
  radius,
  semanticColors,
} from '@jujistu/shared/theme';

export interface BottomSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly closeAccessibilityLabel?: string;
  readonly children?: React.ReactNode;
  readonly testID?: string;
}

export function AppBottomSheet({
  visible,
  onClose,
  title,
  closeAccessibilityLabel = 'Đóng',
  children,
  testID = 'app-bottom-sheet',
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.root} testID={testID}>
        <Pressable
          accessibilityLabel={closeAccessibilityLabel}
          accessibilityRole="button"
          onPress={onClose}
          style={styles.backdrop}
          testID={`${testID}-backdrop`}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.grabber} />
          {title ? (
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: semanticColors.background.overlay,
  },
  sheet: {
    backgroundColor: semanticColors.background.surface,
    borderColor: primitiveColors.alpha.white10,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: primitiveColors.alpha.white24,
    borderRadius: radius.full,
    height: 4,
    marginBottom: 14,
    width: 36,
  },
  title: {
    ...dsTypography.title,
    color: semanticColors.text.primary,
    marginBottom: 12,
  },
});
