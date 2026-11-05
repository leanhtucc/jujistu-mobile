import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon, AppPressable } from '@jujistu/ui';
import React, { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import {
  HOME_UPCOMING_TOURNAMENT,
  type HomeUpcomingTournament,
} from '../data/home-content';

export interface HomeUpcomingTournamentCardProps {
  readonly tournament?: HomeUpcomingTournament;
  readonly onPressTournament?: (tournament: HomeUpcomingTournament) => void;
  readonly onToggleRemind?: (reminded: boolean) => void;
}

export function HomeUpcomingTournamentCard({
  tournament = HOME_UPCOMING_TOURNAMENT,
  onPressTournament,
  onToggleRemind,
}: HomeUpcomingTournamentCardProps) {
  const [isReminded, setIsReminded] = useState(false);
  const remindScale = useRef(new Animated.Value(1)).current;
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const d = parseInt(tournament.countdown.days, 10) || 16;
    const h = parseInt(tournament.countdown.hours, 10) || 12;
    const m = parseInt(tournament.countdown.minutes, 10) || 27;
    const s = parseInt(tournament.countdown.seconds, 10) || 39;
    return d * 86400 + h * 3600 + m * 60 + s;
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = String(Math.floor(secondsLeft / 86400)).padStart(2, '0');
  const hours = String(Math.floor((secondsLeft % 86400) / 3600)).padStart(
    2,
    '0',
  );
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(
    2,
    '0',
  );
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleRemindToggle = () => {
    Animated.sequence([
      Animated.timing(remindScale, {
        duration: 90,
        toValue: 1.15,
        useNativeDriver: true,
      }),
      Animated.spring(remindScale, {
        bounciness: 12,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    const nextState = !isReminded;
    setIsReminded(nextState);
    onToggleRemind?.(nextState);
  };

  const countdownItems = [
    { value: days, label: 'NGÀY' },
    { value: hours, label: 'GIỜ' },
    { value: minutes, label: 'PHÚT' },
    { value: seconds, label: 'GIÂY' },
  ];

  return (
    <View style={styles.root}>
      <AppPressable
        accessibilityLabel={tournament.name}
        accessibilityRole="button"
        onPress={() => onPressTournament?.(tournament)}
        style={styles.cardContainer}
      >
        <Image
          resizeMode="cover"
          source={tournament.banner}
          style={[StyleSheet.absoluteFill, styles.bannerImage]}
        />
        {/* Dark gradient overlay */}
        <View style={styles.overlay} />

        {/* Content */}
        <View style={styles.content}>
          {/* Header / Titles */}
          <View>
            <Text style={styles.overline}>{tournament.overline}</Text>
            <Text numberOfLines={2} style={styles.title}>
              {tournament.name}
            </Text>
            <Text numberOfLines={1} style={styles.venue}>
              {tournament.venue}
            </Text>
          </View>

          {/* Countdown 4 blocks */}
          <View style={styles.countdownRow}>
            {countdownItems.map(item => (
              <View key={item.label} style={styles.countdownBox}>
                <Text style={styles.countdownValue}>{item.value}</Text>
                <Text style={styles.countdownLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Bottom info and Remind button */}
          <View style={styles.bottomRow}>
            <Text style={styles.ticketNotice}>{tournament.ticketNotice}</Text>

            <Animated.View style={{ transform: [{ scale: remindScale }] }}>
              <AppPressable
                accessibilityLabel={isReminded ? 'Đã bật nhắc' : 'Nhắc tôi'}
                accessibilityRole="button"
                onPress={handleRemindToggle}
                style={({ pressed }) => [
                  styles.remindButton,
                  isReminded && styles.remindButtonActive,
                  pressed && styles.remindButtonPressed,
                ]}
              >
                <AppIcon
                  color={
                    isReminded
                      ? primitiveColors.orange[500]
                      : primitiveColors.neutral[0]
                  }
                  name={isReminded ? 'bellRinging' : 'bellPhosphor'}
                  size={14}
                />
                <Text
                  style={[
                    styles.remindText,
                    isReminded && styles.remindTextActive,
                  ]}
                >
                  {isReminded ? 'Đã bật nhắc' : 'Nhắc tôi'}
                </Text>
              </AppPressable>
            </Animated.View>
          </View>
        </View>
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    backgroundColor: primitiveColors.neutral[900],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundImage: {
    width: '100%',
  },
  bannerImage: {
    opacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(11, 10, 10, 0.75)',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  overline: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: 4,
  },
  venue: {
    color: primitiveColors.neutral[300],
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  countdownRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countdownBox: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownValue: {
    color: primitiveColors.neutral[0],
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
  countdownLabel: {
    color: primitiveColors.neutral[300],
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  ticketNotice: {
    color: primitiveColors.neutral[200],
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: primitiveColors.neutral[800],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
  },
  remindButtonActive: {
    borderColor: primitiveColors.orange[500],
  },
  remindButtonPressed: {
    opacity: 0.8,
  },
  remindText: {
    color: primitiveColors.neutral[100],
    fontSize: 12,
    fontWeight: '700',
  },
  remindTextActive: {
    color: primitiveColors.orange[500],
  },
});
