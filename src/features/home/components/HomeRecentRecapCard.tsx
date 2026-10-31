import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_RECENT_RECAP, type HomeRecentRecap } from '../data/home-content';

export interface HomeRecentRecapCardProps {
  readonly recap?: HomeRecentRecap;
  readonly onPressResults?: () => void;
}

export function HomeRecentRecapCard({
  recap = HOME_RECENT_RECAP,
  onPressResults,
}: HomeRecentRecapCardProps) {
  return (
    <View style={styles.root}>
      <Pressable
        accessibilityLabel={`${recap.name} - Xem kết quả`}
        accessibilityRole="button"
        onPress={onPressResults}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
      >
        {/* Title area */}
        <View style={styles.header}>
          <Text style={styles.overline}>{recap.overline}</Text>
          <Text numberOfLines={1} style={styles.title}>
            {recap.name}
          </Text>
        </View>

        {/* Standings Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.rankColHeader} />
          <Text style={styles.teamColHeader}>TOÀN ĐOÀN</Text>
          <Text style={styles.medalColHeader}>V</Text>
          <Text style={styles.medalColHeader}>B</Text>
          <Text style={styles.medalColHeader}>Đ</Text>
        </View>

        {/* Standings Rows */}
        <View style={styles.rowsContainer}>
          {recap.standings.map(row => (
            <View key={row.rank} style={styles.tableRow}>
              <Text style={styles.rankText}>{row.rank}</Text>
              <Text numberOfLines={1} style={styles.teamText}>
                {row.team}
              </Text>
              <Text style={styles.medalText}>{row.gold}</Text>
              <Text style={styles.medalText}>{row.silver}</Text>
              <Text style={styles.medalText}>{row.bronze}</Text>
            </View>
          ))}
        </View>

        {/* Action button / link */}
        <View style={styles.actionRow}>
          <Text style={styles.actionText}>XEM KẾT QUẢ</Text>
          <AppIcon
            color={primitiveColors.orange[500]}
            name="arrowRight"
            size={12}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 18,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: primitiveColors.neutral[800],
  },
  header: {
    gap: 4,
  },
  overline: {
    color: primitiveColors.neutral[300],
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: primitiveColors.neutral[0],
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
  },
  rankColHeader: {
    width: 22,
  },
  teamColHeader: {
    flex: 1,
    color: primitiveColors.neutral[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  medalColHeader: {
    width: 32,
    textAlign: 'center',
    color: primitiveColors.neutral[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rowsContainer: {
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'dashed',
  },
  rankText: {
    width: 22,
    color: primitiveColors.orange[500],
    fontSize: 14,
    fontWeight: '800',
  },
  teamText: {
    flex: 1,
    color: primitiveColors.neutral[0],
    fontSize: 14,
    fontWeight: '600',
  },
  medalText: {
    width: 32,
    textAlign: 'center',
    color: primitiveColors.neutral[100],
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  actionText: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
