import {
  dsTypography,
  primitiveColors,
  semanticColors,
} from '@jujistu/shared/theme';
import { AppCard, AppIcon, AppStampIn } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { STREAK_BASE_DONE } from '../data/mission-content';
import type { StreakDay } from '../types/mission.types';

export interface MissionStreakCardProps {
  readonly days: readonly StreakDay[];
  readonly label: string;
  /** Stamps the day that was just claimed. */
  readonly justClaimed?: boolean;
  readonly onClaim: () => void;
}

const CELL = 38;

/** Lands the stamp only for the day claimed in this session. */
function StampWhenNew({
  animate,
  children,
}: {
  readonly animate: boolean;
  readonly children: React.ReactNode;
}) {
  return animate ? <AppStampIn>{children}</AppStampIn> : <>{children}</>;
}

/** A check mark drawn from two borders, since the icon set has no check. */
function CheckMark() {
  return <View style={styles.check} />;
}

export function MissionStreakCard({
  days,
  label,
  justClaimed = false,
  onClaim,
}: MissionStreakCardProps) {
  return (
    <AppCard style={styles.card} stitched testID="mission-streak">
      <View style={styles.head}>
        <Text accessibilityRole="header" style={styles.title}>
          Chuỗi đăng nhập
        </Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.days}>
        {days.map(day => (
          <View key={day.index} style={styles.day}>
            {day.state === 'done' ? (
              <StampWhenNew
                animate={justClaimed && day.index === STREAK_BASE_DONE}
              >
                <View
                  accessibilityLabel={`Ngày ${day.index + 1} đã nhận`}
                  accessible
                  style={styles.done}
                  testID={`mission-streak-done-${day.index}`}
                >
                  <CheckMark />
                </View>
              </StampWhenNew>
            ) : null}
            {day.state === 'today' ? (
              <Pressable
                accessibilityLabel={`Nhận thưởng đăng nhập ngày ${
                  day.index + 1
                }, ${day.reward} Xu`}
                accessibilityRole="button"
                onPress={onClaim}
                style={styles.today}
                testID="mission-streak-claim"
              >
                <AppIcon
                  accessible={false}
                  color={semanticColors.text.accent}
                  name="giftMono"
                  size={18}
                />
              </Pressable>
            ) : null}
            {day.state === 'locked' ? (
              <View
                accessibilityLabel={`Ngày ${day.index + 1} chưa mở`}
                accessible
                style={styles.locked}
              >
                {day.isFinal ? (
                  <AppIcon
                    accessible={false}
                    color={semanticColors.text.tertiary}
                    name="trophy"
                    size={16}
                  />
                ) : null}
              </View>
            ) : null}
            <Text
              style={[
                styles.reward,
                {
                  color:
                    day.state === 'done'
                      ? semanticColors.text.secondary
                      : day.state === 'today'
                      ? semanticColors.text.accent
                      : semanticColors.text.tertiary,
                },
              ]}
            >
              +{day.reward}
            </Text>
          </View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, padding: 16 },
  head: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  title: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  label: { ...dsTypography.counter, color: semanticColors.text.accent },
  days: { flexDirection: 'row', gap: 6 },
  day: { alignItems: 'center', flex: 1, gap: 6 },
  done: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.dangerTint,
    borderColor: semanticColors.action.primary,
    borderRadius: 9,
    borderWidth: 2,
    height: CELL,
    justifyContent: 'center',
    transform: [{ rotate: '-7deg' }],
    width: CELL,
  },
  check: {
    borderBottomColor: semanticColors.action.primary,
    borderBottomWidth: 3,
    borderLeftColor: semanticColors.action.primary,
    borderLeftWidth: 3,
    height: 8,
    marginTop: -3,
    transform: [{ rotate: '-45deg' }],
    width: 15,
  },
  today: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.accentTint,
    borderColor: semanticColors.border.accent,
    borderRadius: 9,
    borderWidth: 1,
    height: CELL,
    justifyContent: 'center',
    shadowColor: primitiveColors.orange[500],
    shadowOpacity: 0.35,
    shadowRadius: 8,
    width: CELL,
  },
  locked: {
    alignItems: 'center',
    borderColor: semanticColors.border.default,
    borderRadius: 9,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: CELL,
    justifyContent: 'center',
    width: CELL,
  },
  reward: { ...dsTypography.counter, fontSize: 10, lineHeight: 12 },
});
