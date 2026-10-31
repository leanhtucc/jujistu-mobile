import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SESSION_URGENT_BELOW } from '../data/ticket-selectors';
import type { TicketSession } from '../types/ticket.types';

export interface TicketSessionPickerProps {
  readonly sessions: readonly TicketSession[];
  readonly activeIndex: number;
  readonly onSelect: (index: number) => void;
}

export function TicketSessionPicker({
  sessions,
  activeIndex,
  onSelect,
}: TicketSessionPickerProps) {
  return (
    <View style={styles.root} testID="ticket-sessions">
      {sessions.map((session, index) => {
        const selected = index === activeIndex;
        const hot = session.remaining[0] <= SESSION_URGENT_BELOW;

        return (
          <Pressable
            accessibilityLabel={`${session.date}, ${session.kind}, ${session.startTime}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={session.date}
            onPress={() => onSelect(index)}
            style={[styles.card, selected ? styles.cardSelected : null]}
            testID={`ticket-session-${index}`}
          >
            <Text
              style={[
                styles.date,
                {
                  color: selected
                    ? semanticColors.text.accent
                    : semanticColors.text.tertiary,
                },
              ]}
            >
              {session.date}
            </Text>
            <Text style={styles.label}>{session.label}</Text>
            <Text style={styles.time}>{session.startTime}</Text>
            <Text
              style={[
                styles.kind,
                {
                  color: selected
                    ? semanticColors.text.accent
                    : semanticColors.text.primary,
                },
              ]}
            >
              {session.kindShort}
            </Text>
            {hot ? <View style={styles.hotDot} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', gap: 8 },
  card: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    minWidth: 0,
    padding: 10,
  },
  cardSelected: {
    backgroundColor: semanticColors.background.accentTint,
    borderColor: semanticColors.border.accent,
  },
  date: { ...dsTypography.counter, lineHeight: 14 },
  label: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  time: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 18,
    lineHeight: 22,
  },
  kind: {
    ...dsTypography.body,
    fontSize: 12,
    lineHeight: 16,
  },
  hotDot: {
    backgroundColor: semanticColors.action.primary,
    borderRadius: 3,
    height: 6,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 6,
  },
});
