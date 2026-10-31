import {
  dsTypography,
  radius,
  semanticColors,
  spacing,
} from '@jujistu/shared/theme';
import {
  AppHeader,
  AppIcon,
  AppProgressBar,
  AppSegmentedControl,
  AppToast,
} from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MissionRow } from '../components/MissionRow';
import { MissionStreakCard } from '../components/MissionStreakCard';
import { useMissions } from '../hooks/use-missions';
import type { MissionTab } from '../types/mission.types';

const CONTENT_MAX_WIDTH = 720;

export interface MissionScreenProps {
  readonly onBack?: () => void;
  /** Wallet balance owned by the app; omit to use a local balance. */
  readonly coins?: number;
  /** Called with the coins granted whenever a reward is claimed. */
  readonly onEarn?: (amount: number) => void;
}

export function MissionScreen({ onBack, coins, onEarn }: MissionScreenProps) {
  const insets = useSafeAreaInsets();
  const missions = useMissions({ coins, onEarn });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {onBack ? (
        <AppHeader
          backAccessibilityLabel="Quay lại"
          onBackPress={onBack}
          title="Nhiệm vụ"
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="mission-scroll"
      >
        <View style={styles.column}>
          <View style={[styles.gutter, styles.titleRow]}>
            <View style={styles.titleBlock}>
              <Text style={styles.overline}>NHIỆM VỤ</Text>
              <Text accessibilityRole="header" style={styles.title}>
                Tích Xu mỗi ngày
              </Text>
            </View>
            <View
              accessibilityLabel={`Số dư ${missions.coinsLabel} Xu`}
              accessible
              style={styles.coinChip}
              testID="mission-coins"
            >
              <AppIcon
                accessible={false}
                color={semanticColors.text.accent}
                name="coinsPhosphor"
                size={16}
              />
              <Text style={styles.coinText}>{missions.coinsLabel}</Text>
            </View>
          </View>

          <View style={styles.gutter}>
            <MissionStreakCard
              days={missions.streak}
              justClaimed={missions.streakClaimed}
              label={missions.streakLabel}
              onClaim={missions.claimStreak}
            />
          </View>

          <View style={[styles.gutter, styles.week]} testID="mission-week">
            <View style={styles.weekHead}>
              <Text style={styles.weekLabel}>Đã hoàn thành tuần này</Text>
              <Text style={styles.weekCount}>
                {missions.weekDone} / {missions.weekTotal}
              </Text>
            </View>
            <AppProgressBar
              accessibilityLabel={`Đã hoàn thành ${missions.weekDone} trên ${missions.weekTotal} nhiệm vụ tuần`}
              value={missions.weekFraction}
            />
          </View>

          <View style={styles.gutter}>
            <AppSegmentedControl
              activeKey={missions.activeTab}
              onChange={key => missions.selectTab(key as MissionTab)}
              options={missions.tabs}
              testID="mission-tabs"
            />
          </View>

          <Text style={[styles.gutter, styles.refresh]}>
            Làm mới sau{' '}
            <Text style={styles.refreshTime}>{missions.refreshLabel}</Text>
          </Text>

          <View style={[styles.gutter, styles.list]}>
            {missions.missions.map(mission => (
              <MissionRow
                key={mission.id}
                mission={mission}
                onPress={missions.onPressMission}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {missions.toast ? (
        <View pointerEvents="none" style={styles.toast} testID="mission-toast">
          <AppToast
            message={missions.toast.message}
            status="neutral"
            styleVariant="style2"
            visible
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: semanticColors.background.canvas, flex: 1 },
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 10 },
  column: { gap: 20, maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  gutter: { paddingHorizontal: spacing.gutter },
  titleRow: { alignItems: 'flex-end', flexDirection: 'row', gap: 10 },
  titleBlock: { flex: 1, minWidth: 0 },
  overline: {
    ...dsTypography.overline,
    color: semanticColors.text.accent,
    marginBottom: 6,
  },
  title: { ...dsTypography.display, color: semanticColors.text.primary },
  coinChip: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.accent,
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
  },
  coinText: { ...dsTypography.counter, color: semanticColors.text.primary },
  week: { gap: 8 },
  weekHead: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekLabel: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  weekCount: { ...dsTypography.counter, color: semanticColors.text.primary },
  refresh: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: -8,
  },
  refreshTime: {
    ...dsTypography.counter,
    color: semanticColors.text.secondary,
  },
  list: { gap: 10 },
  toast: {
    bottom: 16,
    left: spacing.gutter,
    position: 'absolute',
    right: spacing.gutter,
  },
});
