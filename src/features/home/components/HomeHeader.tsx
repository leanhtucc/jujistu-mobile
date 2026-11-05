import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon, AppPressable } from '@jujistu/ui';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export interface HomeHeaderProps {
  readonly dateText?: string;
  readonly userName?: string;
  readonly coinBalance?: number;
  /** Shows the unread dot on the bell. Defaults to true. */
  readonly hasUnreadNotifications?: boolean;
  readonly onOpenCoins?: () => void;
  readonly onOpenNotifications?: () => void;
}

export function HomeHeader({
  dateText = 'THỨ TƯ · 07/10',
  userName = 'Minh',
  coinBalance = 12500,
  hasUnreadNotifications = true,
  onOpenCoins,
  onOpenNotifications,
}: HomeHeaderProps) {
  const formattedCoins = coinBalance.toLocaleString('vi-VN');
  const coinScale = useRef(new Animated.Value(1)).current;

  const handleCoinPress = () => {
    Animated.sequence([
      Animated.timing(coinScale, {
        duration: 90,
        toValue: 1.25,
        useNativeDriver: true,
      }),
      Animated.spring(coinScale, {
        bounciness: 14,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onOpenCoins?.();
  };

  return (
    <View style={styles.root}>
      {/* Left greeting and overline */}
      <View style={styles.greetingCol}>
        <Text style={styles.overline}>{dateText}</Text>
        <Text numberOfLines={1} style={styles.greetingTitle}>
          Chào, {userName}
        </Text>
      </View>

      {/* Right actions: Coin pill + Bell notification */}
      <View style={styles.rightActions}>
        <Animated.View style={{ transform: [{ scale: coinScale }] }}>
          <AppPressable
            accessibilityLabel={`Số dư ${formattedCoins} xu`}
            accessibilityRole="button"
            onPress={handleCoinPress}
            style={({ pressed }) => [
              styles.coinPill,
              pressed && styles.pillPressed,
            ]}
          >
            <AppIcon
              color={primitiveColors.orange[500]}
              name="coin"
              size={16}
            />
            <Text style={styles.coinText}>{formattedCoins}</Text>
          </AppPressable>
        </Animated.View>

        <AppPressable
          accessibilityLabel="Thông báo"
          accessibilityRole="button"
          onPress={onOpenNotifications}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <AppIcon
            color={primitiveColors.neutral[0]}
            name="bellPhosphor"
            size={18}
          />
          {hasUnreadNotifications ? (
            <View style={styles.unreadBadge} testID="home-unread-badge" />
          ) : null}
        </AppPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  greetingCol: {
    justifyContent: 'center',
    gap: 2,
    flex: 1,
  },
  overline: {
    color: primitiveColors.orange[500],
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  greetingTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 19,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
  },
  pillPressed: {
    backgroundColor: primitiveColors.neutral[800],
  },
  coinText: {
    color: primitiveColors.neutral[0],
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D42A1E',
    borderWidth: 1.5,
    borderColor: '#181515',
  },
  iconButtonPressed: {
    backgroundColor: primitiveColors.neutral[800],
  },
});
