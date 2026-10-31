import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import {
  AppButton,
  AppCard,
  AppIcon,
  AppProgressBar,
  AppTag,
} from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatCoins } from '../data/mission-selectors';
import type { MissionRowModel } from '../types/mission.types';

export interface MissionRowProps {
  readonly mission: MissionRowModel;
  readonly onPress: (missionId: string) => void;
}

export function MissionRow({ mission, onPress }: MissionRowProps) {
  const claimable = mission.status === 'claimable';
  const claimed = mission.status === 'claimed';
  const handlePress = () => onPress(mission.id);

  return (
    <AppCard
      lapel={false}
      selected={claimable}
      stitched={claimable}
      style={styles.card}
      testID={`mission-row-${mission.id}`}
      variant={claimable ? 'elevated' : 'surface'}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: claimable
                ? semanticColors.background.accentTint
                : semanticColors.background.surfaceElevated,
            },
          ]}
        >
          <AppIcon
            accessible={false}
            color={
              claimed
                ? semanticColors.icon.tertiary
                : semanticColors.text.accent
            }
            name={mission.icon}
            size={20}
          />
        </View>

        <View style={styles.body}>
          <Text
            style={[
              styles.title,
              {
                color: claimed
                  ? semanticColors.text.tertiary
                  : semanticColors.text.primary,
              },
            ]}
          >
            {mission.title}
          </Text>
          {mission.showProgress ? (
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <AppProgressBar
                  accessibilityLabel={`Tiến độ ${mission.progressLabel}`}
                  height={4}
                  testID={`mission-progress-${mission.id}`}
                  value={mission.fraction}
                />
              </View>
              <Text style={styles.progressText}>{mission.progressLabel}</Text>
            </View>
          ) : null}
          <View style={styles.reward}>
            <AppIcon
              accessible={false}
              color={
                claimed
                  ? semanticColors.icon.tertiary
                  : semanticColors.text.accent
              }
              name="coinsPhosphor"
              size={13}
            />
            <Text
              style={[
                styles.rewardText,
                {
                  color: claimed
                    ? semanticColors.text.tertiary
                    : semanticColors.text.accent,
                },
              ]}
            >
              +{formatCoins(mission.reward)} Xu
            </Text>
          </View>
        </View>

        <View style={styles.action}>
          {mission.status === 'todo' ? (
            <AppButton
              appearance="soft"
              disabled={mission.busy}
              label={mission.busy ? 'Đang mở…' : 'Thực hiện'}
              onPress={handlePress}
              size="sm"
              variant="secondaryDark"
            />
          ) : null}
          {claimable ? (
            <AppButton label="Nhận" onPress={handlePress} size="sm" />
          ) : null}
          {claimed ? (
            <Text
              accessibilityLabel="Đã nhận"
              style={styles.claimed}
              testID={`mission-claimed-${mission.id}`}
            >
              ĐÃ NHẬN
            </Text>
          ) : null}
          {mission.status === 'pending' ? (
            <AppTag label="Tự ghi nhận" variant="outline" />
          ) : null}
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  iconBox: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  body: { flex: 1, gap: 7, minWidth: 0 },
  title: dsTypography.bodyStrong,
  progressRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  progressBar: { flex: 1 },
  progressText: {
    ...dsTypography.counter,
    color: semanticColors.text.secondary,
    fontSize: 11,
    lineHeight: 12,
  },
  reward: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  rewardText: { ...dsTypography.counter },
  action: { minWidth: 84 },
  claimed: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    textAlign: 'right',
  },
});
