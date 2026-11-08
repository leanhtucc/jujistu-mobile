import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppCard, AppIcon, AppPressable, AppStampIn } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

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

/** A check mark drawn from two borders, matching the jiu-jitsu stamp style. */
function CheckMark() {
  return <View style={styles.check} />;
}

/** Phosphor lock-simple vector icon for future locked days. */
function LockIcon({
  size = 16,
  color,
}: {
  readonly size?: number;
  readonly color: string;
}) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 256 256" width={size}>
      <Rect
        fill="none"
        height={128}
        rx={20}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={18}
        width={176}
        x={40}
        y={88}
      />
      <Path
        d="M88 88V56a40 40 0 0 1 80 0v32"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={18}
      />
    </Svg>
  );
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
              <AppPressable
                accessibilityLabel={`Nhận thưởng đăng nhập ngày ${
                  day.index + 1
                }, ${day.reward} Xu`}
                accessibilityRole="button"
                onPress={onClaim}
                style={({ pressed }) => [
                  styles.today,
                  pressed && styles.todayPressed,
                ]}
                testID="mission-streak-claim"
              >
                <AppIcon
                  accessible={false}
                  color={semanticColors.text.accent}
                  name="giftMono"
                  size={18}
                />
              </AppPressable>
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
                ) : (
                  <LockIcon color={semanticColors.text.tertiary} size={15} />
                )}
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
    borderWidth: 1.5,
    height: CELL,
    justifyContent: 'center',
    transform: [{ rotate: '-7deg' }],
    width: CELL,
  },
  check: {
    borderBottomColor: semanticColors.action.primary,
    borderBottomWidth: 2.5,
    borderRightColor: semanticColors.action.primary,
    borderRightWidth: 2.5,
    height: 14,
    transform: [{ rotate: '45deg' }, { translateY: -1 }],
    width: 8,
  },
  today: {
    alignItems: 'center',
    backgroundColor: 'rgba(254, 139, 51, 0.14)',
    borderColor: semanticColors.border.accent,
    borderRadius: 9,
    borderWidth: 1.5,
    height: CELL,
    justifyContent: 'center',
    width: CELL,
  },
  todayPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },
  locked: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: semanticColors.border.default,
    borderRadius: 9,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: CELL,
    justifyContent: 'center',
    width: CELL,
  },
  reward: {
    ...dsTypography.counter,
    fontSize: 10,
    lineHeight: 12,
  },
});
