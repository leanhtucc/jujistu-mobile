import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppTab } from './app-tab';
import type { TabListProps } from './tab-list.types';

export function AppTabList<Key extends string = string>({
  items,
  activeKey,
  onTabPress,
  size = 'md',
  appearance = 'filled',
  variant = 'primary',
  scrollable = false,
  gap = 8,
  style,
  contentContainerStyle,
  tabStyle,
  testID,
}: TabListProps<Key>) {
  const content = (
    <View
      accessibilityRole="tablist"
      style={[styles.row, { gap }, contentContainerStyle]}
    >
      {items.map(item => {
        const selected = item.key === activeKey;

        return (
          <AppTab
            accessibilityLabel={item.accessibilityLabel}
            appearance={appearance}
            disabled={item.disabled}
            key={item.key}
            label={item.label}
            leadingIcon={item.leadingIcon}
            onPress={() => onTabPress(item.key)}
            selected={selected}
            size={size}
            style={tabStyle}
            trailingIcon={item.trailingIcon}
            variant={variant}
          />
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}
        testID={testID}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={style} testID={testID}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  scrollContent: {
    flexGrow: 0,
  },
});
