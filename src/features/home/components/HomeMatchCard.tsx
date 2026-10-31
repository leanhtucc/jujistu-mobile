import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon } from '@jujistu/ui';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  HOME_FEATURED_MATCH,
  type HomeFeaturedMatch,
} from '../data/home-content';

export interface HomeMatchCardProps {
  readonly match?: HomeFeaturedMatch;
  readonly onPressAthlete?: (athleteName: string) => void;
  readonly onPressLive?: () => void;
}

export function HomeMatchCard({
  match = HOME_FEATURED_MATCH,
  onPressAthlete,
  onPressLive,
}: HomeMatchCardProps) {
  const [seconds, setSeconds] = useState(match.secondsRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.root}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>TRẬN TÂM ĐIỂM TỐI NAY</Text>
        </View>
        <Text style={styles.liveIndicator}>LIVE 20:00</Text>
      </View>

      {/* Main Match Container */}
      <View style={styles.container}>
        {/* Background arena image with dark overlay */}
        <Image
          resizeMode="cover"
          source={match.arenaImage}
          style={styles.backgroundImage}
        />
        <View style={styles.darkOverlay} />

        {/* Header inside card */}
        <View style={styles.matchMeta}>
          <Text numberOfLines={1} style={styles.matchDivision}>
            {match.title}
          </Text>
          <Text numberOfLines={1} style={styles.matchTournament}>
            {match.tournamentName}
          </Text>
        </View>

        {/* Face-off split area */}
        <View style={styles.faceoffRow}>
          {/* Athlete A */}
          <Pressable
            onPress={() => onPressAthlete?.(match.athleteA.name)}
            style={styles.athleteCol}
          >
            <View style={styles.avatarBorder}>
              <Image
                resizeMode="cover"
                source={match.athleteA.image}
                style={styles.avatarImage}
              />
            </View>
            <Text numberOfLines={1} style={styles.athleteName}>
              {match.athleteA.name}
            </Text>
            <Text numberOfLines={1} style={styles.athleteTeam}>
              {match.athleteA.team}
            </Text>
            <View style={styles.beltBadge}>
              <View style={styles.beltDot} />
              <Text style={styles.beltText}>{match.athleteA.belt}</Text>
            </View>
          </Pressable>

          {/* VS Center Badge */}
          <View style={styles.vsBadgeContainer}>
            <View style={styles.vsBadge}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <Text style={styles.weightText}>{match.athleteA.weight}</Text>
          </View>

          {/* Athlete B */}
          <Pressable
            onPress={() => onPressAthlete?.(match.athleteB.name)}
            style={styles.athleteCol}
          >
            <View style={styles.avatarBorder}>
              <Image
                resizeMode="cover"
                source={match.athleteB.image}
                style={styles.avatarImage}
              />
            </View>
            <Text numberOfLines={1} style={styles.athleteName}>
              {match.athleteB.name}
            </Text>
            <Text numberOfLines={1} style={styles.athleteTeam}>
              {match.athleteB.team}
            </Text>
            <View style={styles.beltBadge}>
              <View style={styles.beltDot} />
              <Text style={styles.beltText}>{match.athleteB.belt}</Text>
            </View>
          </Pressable>
        </View>

        {/* Countdown Box */}
        <View style={styles.countdownContainer}>
          <View style={styles.countdownUnit}>
            <Text style={styles.countdownValue}>{pad(d)}</Text>
            <Text style={styles.countdownLabel}>NGÀY</Text>
          </View>
          <Text style={styles.countdownSep}>:</Text>
          <View style={styles.countdownUnit}>
            <Text style={styles.countdownValue}>{pad(h)}</Text>
            <Text style={styles.countdownLabel}>GIỜ</Text>
          </View>
          <Text style={styles.countdownSep}>:</Text>
          <View style={styles.countdownUnit}>
            <Text style={styles.countdownValue}>{pad(m)}</Text>
            <Text style={styles.countdownLabel}>PHÚT</Text>
          </View>
          <Text style={styles.countdownSep}>:</Text>
          <View style={styles.countdownUnit}>
            <Text style={styles.countdownValue}>{pad(s)}</Text>
            <Text style={styles.countdownLabel}>GIÂY</Text>
          </View>
        </View>

        {/* CTA Watch YouTube Button */}
        <Pressable
          accessibilityLabel="Xem trực tiếp trên YouTube"
          accessibilityRole="button"
          onPress={onPressLive}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <AppIcon color={primitiveColors.neutral[0]} name="play" size={18} />
          <Text style={styles.ctaButtonText}>XEM TRỰC TIẾP TRÊN YOUTUBE</Text>
        </Pressable>
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
  liveIndicator: {
    color: primitiveColors.orange[500],
    fontSize: 12,
    fontWeight: '700',
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.28,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 10, 10, 0.72)',
  },
  matchMeta: {
    alignItems: 'center',
    marginBottom: 16,
  },
  matchDivision: {
    color: primitiveColors.neutral[0],
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  matchTournament: {
    color: primitiveColors.neutral[200],
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  faceoffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  athleteCol: {
    flex: 1,
    alignItems: 'center',
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: primitiveColors.orange[500],
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  athleteName: {
    color: primitiveColors.neutral[0],
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  athleteTeam: {
    color: primitiveColors.neutral[300],
    fontSize: 11,
    marginTop: 1,
    textAlign: 'center',
  },
  beltBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: primitiveColors.neutral[800],
  },
  beltDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: primitiveColors.belt.brown,
  },
  beltText: {
    color: primitiveColors.neutral[100],
    fontSize: 10,
    fontWeight: '600',
  },
  vsBadgeContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  vsBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: primitiveColors.red[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: primitiveColors.neutral[900],
  },
  vsText: {
    color: primitiveColors.neutral[0],
    fontSize: 14,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  weightText: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primitiveColors.neutral[900],
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white06,
    marginBottom: 14,
    gap: 8,
  },
  countdownUnit: {
    alignItems: 'center',
    minWidth: 44,
  },
  countdownValue: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  countdownLabel: {
    color: primitiveColors.neutral[300],
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  countdownSep: {
    color: primitiveColors.orange[500],
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: primitiveColors.red[500],
    shadowColor: primitiveColors.red[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonPressed: {
    opacity: 0.88,
  },
  ctaButtonText: {
    color: primitiveColors.neutral[0],
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
