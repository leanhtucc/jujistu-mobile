import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppBottomSheet, AppIcon, AppPressable } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { NotificationItem } from '../types/notification.types';

export interface NotificationCenterProps {
  readonly visible: boolean;
  readonly items: readonly NotificationItem[];
  readonly onClose: () => void;
  readonly onSelect: (item: NotificationItem) => void;
}

export function NotificationCenter({
  visible,
  items,
  onClose,
  onSelect,
}: NotificationCenterProps) {
  return (
    <AppBottomSheet
      onClose={onClose}
      testID="notification-center"
      title="Thông báo"
      visible={visible}
    >
      {items.length === 0 ? (
        <View style={styles.empty} testID="notification-empty">
          <Text style={styles.emptyText}>Bạn chưa có thông báo nào</Text>
        </View>
      ) : (
        <View>
          {items.map(item => (
            <AppPressable
              accessibilityLabel={`${item.title}, ${item.timeLabel}`}
              accessibilityRole="button"
              key={item.id}
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.row,
                pressed ? styles.pressed : null,
              ]}
              testID={`notification-${item.id}`}
            >
              <View style={styles.iconBox}>
                <AppIcon
                  accessible={false}
                  color={semanticColors.text.accent}
                  name={item.icon}
                  size={18}
                />
              </View>
              <View style={styles.text}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.timeLabel}</Text>
              </View>
            </AppPressable>
          ))}
        </View>
      )}
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomColor: semanticColors.stitch.color,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  pressed: { opacity: 0.8 },
  iconBox: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surfaceElevated,
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  text: { flex: 1, gap: 2, minWidth: 0 },
  title: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  time: { ...dsTypography.counter, color: semanticColors.text.tertiary },
  empty: { alignItems: 'center', paddingVertical: 28 },
  emptyText: { ...dsTypography.body, color: semanticColors.text.secondary },
});
