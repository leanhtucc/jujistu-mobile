import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import { AppAvatar, AppButton } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  FACE_OFF_ATHLETES,
  FACE_OFF_DONE_SUMMARY,
} from '../data/tournament-content';
import type {
  SessionStatus,
  TournamentDay,
  TournamentSessionEntry,
} from '../types/tournament.types';

export interface TournamentScheduleTabProps {
  readonly days: readonly TournamentDay[];
  readonly activeDay: TournamentDay;
  readonly todayIndex: number | null;
  readonly onSelectDay: (index: number) => void;
  readonly sessions: readonly TournamentSessionEntry[];
  readonly onPressAthlete?: (athleteId: string) => void;
  readonly onPressWatch?: () => void;
}

const DOT_COLORS: Record<SessionStatus, string> = {
  now: semanticColors.action.primary,
  soon: semanticColors.text.accent,
  done: semanticColors.border.strong,
  later: semanticColors.background.surfaceElevated,
};

const STATUS_TEXT_COLORS: Record<SessionStatus, string> = {
  now: semanticColors.text.accent,
  soon: semanticColors.text.secondary,
  done: semanticColors.text.tertiary,
  later: semanticColors.text.tertiary,
};

export function TournamentScheduleTab({
  days,
  activeDay,
  todayIndex,
  onSelectDay,
  sessions,
  onPressAthlete,
  onPressWatch,
}: TournamentScheduleTabProps) {
  return (
    <View style={styles.root} testID="tournament-schedule-tab">
      <View style={styles.dayGrid}>
        {days.map(day => {
          const selected = day.index === activeDay.index;
          const isToday = day.index === todayIndex;
          const past = todayIndex === null || day.index < todayIndex;
          const dotColor = isToday
            ? semanticColors.action.primary
            : past
            ? semanticColors.border.strong
            : 'transparent';

          return (
            <Pressable
              accessibilityLabel={`Ngày ${day.index + 1}, ${day.dateLabel}${
                isToday ? ', hôm nay' : ''
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={day.dateLabel}
              onPress={() => onSelectDay(day.index)}
              style={[styles.day, selected ? styles.daySelected : null]}
              testID={`tournament-day-${day.index}`}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isToday ? { color: semanticColors.text.accent } : null,
                ]}
              >
                {isToday ? 'H.NAY' : `N${day.index + 1}`}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: selected
                      ? semanticColors.text.accent
                      : past
                      ? semanticColors.text.secondary
                      : semanticColors.text.primary,
                  },
                ]}
              >
                {day.dateLabel.slice(0, 2)}
              </Text>
              <View style={[styles.dayDot, { backgroundColor: dotColor }]} />
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.focus}>
        {`Ngày ${activeDay.index + 1} · ${activeDay.dateLabel}/2026 · ${
          activeDay.focus
        }`}
      </Text>

      <View>
        {sessions.map(({ session, status, statusLabel }) => (
          <View
            key={`${session.time}-${session.title}-${session.kind}`}
            style={styles.sessionRow}
            testID={`tournament-session-${session.time}`}
          >
            <Text
              style={[
                styles.time,
                {
                  color:
                    status === 'done'
                      ? semanticColors.text.tertiary
                      : semanticColors.text.primary,
                },
              ]}
            >
              {session.time}
            </Text>
            <View style={styles.timeline}>
              <View style={styles.timelineLine} />
              <View
                style={[
                  styles.timelineNode,
                  { backgroundColor: DOT_COLORS[status] },
                ]}
              />
            </View>
            <View
              style={[
                styles.sessionCard,
                status === 'now' ? styles.sessionCardNow : null,
              ]}
            >
              <View style={styles.sessionHead}>
                <Text style={styles.sessionKind}>
                  {session.kind} · {session.mats}
                </Text>
                <Text
                  style={[
                    styles.sessionStatus,
                    { color: STATUS_TEXT_COLORS[status] },
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
              <Text
                style={[
                  styles.sessionTitle,
                  {
                    color:
                      status === 'done'
                        ? semanticColors.text.secondary
                        : semanticColors.text.primary,
                  },
                ]}
              >
                {session.title}
              </Text>
              {session.isFaceOff ? (
                <Pressable
                  accessibilityLabel={`Xem hồ sơ ${FACE_OFF_ATHLETES.home}`}
                  accessibilityRole="button"
                  onPress={() => onPressAthlete?.(FACE_OFF_ATHLETES.home)}
                  style={styles.faceOff}
                  testID="tournament-face-off"
                >
                  <AppAvatar name={FACE_OFF_ATHLETES.home} size={26} />
                  <Text style={styles.faceOffText}>
                    {status === 'done'
                      ? FACE_OFF_DONE_SUMMARY
                      : `${FACE_OFF_ATHLETES.home} vs ${FACE_OFF_ATHLETES.away}`}
                  </Text>
                  <AppAvatar name={FACE_OFF_ATHLETES.away} size={26} />
                </Pressable>
              ) : null}
              {status === 'now' ? (
                <View style={styles.watch}>
                  <AppButton
                    appearance="ghost"
                    icon="youtubeLogo"
                    label="Xem trên YouTube"
                    onPress={() => onPressWatch?.()}
                    size="sm"
                  />
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 14 },
  dayGrid: { flexDirection: 'row', gap: 4 },
  day: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    paddingVertical: 8,
  },
  daySelected: {
    backgroundColor: semanticColors.background.accentTint,
    borderColor: semanticColors.border.accent,
  },
  dayLabel: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    fontSize: 10,
    lineHeight: 12,
  },
  dayNumber: { ...dsTypography.counter, fontSize: 15, lineHeight: 18 },
  dayDot: { borderRadius: radius.full, height: 4, width: 4 },
  focus: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  sessionRow: { flexDirection: 'row', gap: 10 },
  time: {
    ...dsTypography.counter,
    fontSize: 14,
    paddingTop: 16,
    width: 46,
  },
  timeline: { alignItems: 'center', width: 14 },
  timelineLine: {
    borderColor: semanticColors.border.default,
    borderLeftWidth: 1,
    bottom: 0,
    position: 'absolute',
    top: 0,
  },
  timelineNode: {
    borderRadius: 2,
    height: 10,
    marginTop: 18,
    transform: [{ rotate: '45deg' }],
    width: 10,
  },
  sessionCard: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.md + 4,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sessionCardNow: {
    backgroundColor: semanticColors.background.surfaceElevated,
    borderColor: semanticColors.border.accent,
  },
  sessionHead: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  sessionKind: {
    ...dsTypography.overline,
    color: semanticColors.text.tertiary,
    flexShrink: 1,
  },
  sessionStatus: dsTypography.overline,
  sessionTitle: dsTypography.bodyStrong,
  faceOff: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.accentTint,
    borderColor: semanticColors.stitch.accent,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  faceOffText: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    minWidth: 0,
  },
  watch: { flexDirection: 'row' },
});
