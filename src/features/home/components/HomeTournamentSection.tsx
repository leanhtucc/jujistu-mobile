import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  HOME_TOURNAMENT_FOCUS,
  type HomeTournamentFocus,
} from '../data/home-content';

export interface HomeTournamentSectionProps {
  readonly tournament?: HomeTournamentFocus;
  readonly onPressSchedule?: () => void;
  readonly onPressTickets?: () => void;
}

export function HomeTournamentSection({
  tournament = HOME_TOURNAMENT_FOCUS,
  onPressSchedule,
  onPressTickets,
}: HomeTournamentSectionProps) {
  return (
    <View style={styles.root}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>GIẢI ĐẤU TIÊU ĐIỂM</Text>
        </View>
        <Text style={styles.badgeText}>ĐÀ NẴNG 2026</Text>
      </View>

      {/* Card Content */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Image
            resizeMode="cover"
            source={tournament.poster}
            style={styles.posterImage}
          />
          <View style={styles.infoCol}>
            <Text numberOfLines={2} style={styles.tournamentName}>
              {tournament.name}
            </Text>
            <View style={styles.metaRow}>
              <AppIcon
                color={primitiveColors.orange[500]}
                name="settings"
                size={14}
              />
              <Text numberOfLines={1} style={styles.metaText}>
                {tournament.location}
              </Text>
            </View>
            <Text style={styles.datesText}>Thời gian: {tournament.days}</Text>

            {/* Stats Pills */}
            <View style={styles.statsRow}>
              {tournament.stats.map(([count, unit]) => (
                <View key={unit} style={styles.statPill}>
                  <Text style={styles.statCount}>{count}</Text>
                  <Text style={styles.statUnit}>{unit}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Buttons Row */}
        <View style={styles.actionsRow}>
          <Pressable
            accessibilityLabel="Xem lịch thi đấu"
            accessibilityRole="button"
            onPress={onPressSchedule}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <AppIcon
              color={primitiveColors.neutral[100]}
              name="tournamentActive"
              size={16}
            />
            <Text style={styles.secondaryButtonText}>Lịch thi đấu</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Đặt vé xem giải"
            accessibilityRole="button"
            onPress={onPressTickets}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <AppIcon color={primitiveColors.neutral[0]} name="gift" size={16} />
            <Text style={styles.primaryButtonText}>Đặt vé khán đài</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: primitiveColors.orange[500],
  },
  sectionTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badgeText: {
    color: primitiveColors.neutral[300],
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    borderRadius: 18,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    padding: 14,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  posterImage: {
    width: 96,
    height: 112,
    borderRadius: 12,
    backgroundColor: primitiveColors.neutral[800],
  },
  infoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tournamentName: {
    color: primitiveColors.neutral[0],
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  metaText: {
    color: primitiveColors.neutral[200],
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  datesText: {
    color: primitiveColors.orange[300],
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: primitiveColors.neutral[800],
  },
  statCount: {
    color: primitiveColors.orange[500],
    fontSize: 10,
    fontWeight: '800',
  },
  statUnit: {
    color: primitiveColors.neutral[200],
    fontSize: 9,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: primitiveColors.neutral[800],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: primitiveColors.red[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  secondaryButtonText: {
    color: primitiveColors.neutral[100],
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButtonText: {
    color: primitiveColors.neutral[0],
    fontSize: 12,
    fontWeight: '700',
  },
});
