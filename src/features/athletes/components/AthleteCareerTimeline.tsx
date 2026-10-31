import { dsTypography, radius, semanticColors } from '@jujistu/shared/theme';
import { AppIcon, AppTag } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  CareerEvent,
  CareerMatch,
  CareerMilestone,
  CareerYear,
  MatchResult,
} from '../types/athlete.types';

export interface AthleteCareerTimelineProps {
  readonly career: readonly CareerYear[];
  readonly isExpanded: (eventId: string) => boolean;
  readonly onToggleEvent: (eventId: string) => void;
  readonly onPressVideo?: () => void;
}

const RESULT_CODES: Record<MatchResult, string> = {
  win: 'T',
  loss: 'B',
  pending: '·',
};

const RESULT_NAMES: Record<MatchResult, string> = {
  win: 'Thắng',
  loss: 'Thua',
  pending: 'Chưa đấu',
};

function MatchRow({
  match,
  onPressVideo,
}: {
  readonly match: CareerMatch;
  readonly onPressVideo?: () => void;
}) {
  return (
    <View style={styles.matchRow}>
      <Text style={styles.matchRound}>{match.round}</Text>
      <View
        accessibilityLabel={RESULT_NAMES[match.result]}
        accessible
        style={[
          styles.matchResult,
          match.result === 'win' ? styles.resultWin : null,
          match.result === 'loss' ? styles.resultLoss : null,
          match.result === 'pending' ? styles.resultPending : null,
        ]}
      >
        <Text
          style={[
            styles.matchResultText,
            {
              color:
                match.result === 'win'
                  ? semanticColors.text.accent
                  : semanticColors.text.tertiary,
            },
          ]}
        >
          {RESULT_CODES[match.result]}
        </Text>
      </View>
      <View style={styles.matchBody}>
        <Text style={styles.opponent}>{match.opponent}</Text>
        <Text style={styles.matchMeta}>
          {match.team} · {match.method}
        </Text>
      </View>
      {match.hasVideo ? (
        <Pressable
          accessibilityLabel={`Xem video trận ${match.round} gặp ${match.opponent}`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onPressVideo}
        >
          <AppIcon
            accessible={false}
            color={semanticColors.text.accent}
            name="playCirclePhosphor"
            size={22}
          />
        </Pressable>
      ) : (
        <View style={styles.videoSlot} />
      )}
    </View>
  );
}

function EventCard({
  event,
  expanded,
  onToggle,
  onPressVideo,
}: {
  readonly event: CareerEvent;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onPressVideo?: () => void;
}) {
  return (
    <View
      style={[styles.event, event.isLive ? styles.eventLive : null]}
      testID={`athlete-event-${event.id}`}
    >
      <Pressable
        accessibilityLabel={`${event.name}, ${event.division}, ${event.outcome}, chiến tích ${event.record}`}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.eventHead}
        testID={`athlete-event-toggle-${event.id}`}
      >
        <View style={styles.eventText}>
          <Text style={styles.eventDate}>{event.dateLabel}</Text>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventDivision}>{event.division}</Text>
        </View>
        <View style={styles.eventSide}>
          <AppTag label={event.outcome} variant={event.outcomeVariant} />
          <Text style={styles.record}>{event.record}</Text>
          <View
            style={{ transform: [{ rotate: expanded ? '-90deg' : '90deg' }] }}
          >
            <AppIcon
              accessible={false}
              color={semanticColors.icon.tertiary}
              name="arrowRight"
              size={14}
            />
          </View>
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.matches}>
          {event.matches.map(match => (
            <MatchRow
              key={`${match.round}-${match.opponent}`}
              match={match}
              onPressVideo={onPressVideo}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function MilestoneCard({ milestone }: { readonly milestone: CareerMilestone }) {
  return (
    <View style={styles.milestone} testID={`athlete-milestone-${milestone.id}`}>
      <View style={styles.milestoneIcon}>
        <AppIcon
          accessible={false}
          color={semanticColors.text.accent}
          name={milestone.icon}
          size={18}
        />
      </View>
      <View style={styles.eventText}>
        <Text style={styles.eventDate}>{milestone.dateLabel}</Text>
        <Text style={styles.milestoneTitle}>{milestone.title}</Text>
        <Text style={styles.eventDivision}>{milestone.description}</Text>
      </View>
    </View>
  );
}

export function AthleteCareerTimeline({
  career,
  isExpanded,
  onToggleEvent,
  onPressVideo,
}: AthleteCareerTimelineProps) {
  return (
    <View testID="athlete-career">
      {career.map(year => (
        <View key={year.year} style={styles.yearRow}>
          <View style={styles.yearColumn}>
            <Text style={styles.year}>{year.year}</Text>
            <View style={styles.yearLine} />
          </View>
          <View style={styles.items}>
            {year.items.map(item =>
              item.kind === 'event' ? (
                <EventCard
                  event={item}
                  expanded={isExpanded(item.id)}
                  key={item.id}
                  onPressVideo={onPressVideo}
                  onToggle={() => onToggleEvent(item.id)}
                />
              ) : (
                <MilestoneCard key={item.id} milestone={item} />
              ),
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  yearRow: { flexDirection: 'row', gap: 10, paddingBottom: 14 },
  yearColumn: { width: 44 },
  year: {
    ...dsTypography.stat,
    backgroundColor: semanticColors.background.canvas,
    color: semanticColors.text.primary,
    fontSize: 16,
    lineHeight: 18,
    paddingBottom: 6,
    paddingTop: 14,
    zIndex: 1,
  },
  yearLine: {
    borderLeftColor: semanticColors.border.default,
    borderLeftWidth: 1,
    bottom: -14,
    left: 16,
    position: 'absolute',
    top: 38,
  },
  items: { flex: 1, gap: 10, minWidth: 0 },
  event: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.md + 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventLive: { borderColor: semanticColors.border.accent },
  eventHead: { flexDirection: 'row', gap: 10, padding: 14 },
  eventText: { flex: 1, gap: 4, minWidth: 0 },
  eventDate: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  eventName: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  eventDivision: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  eventSide: { alignItems: 'flex-end', gap: 6 },
  record: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    fontSize: 11,
    lineHeight: 12,
  },
  matches: { paddingBottom: 6, paddingHorizontal: 14 },
  matchRow: {
    alignItems: 'center',
    borderTopColor: semanticColors.stitch.color,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 10,
  },
  matchRound: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    fontSize: 10,
    lineHeight: 12,
    width: 62,
  },
  matchResult: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 6,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  resultWin: { backgroundColor: semanticColors.background.accentTint },
  resultLoss: { backgroundColor: semanticColors.background.surfaceElevated },
  resultPending: { borderColor: semanticColors.border.default },
  matchResultText: { ...dsTypography.counter, fontSize: 11, lineHeight: 13 },
  matchBody: { flex: 1, minWidth: 0 },
  opponent: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  matchMeta: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  videoSlot: { width: 22 },
  milestone: {
    borderColor: semanticColors.border.default,
    borderRadius: radius.md + 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  milestoneIcon: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surfaceElevated,
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  milestoneTitle: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
  },
});
