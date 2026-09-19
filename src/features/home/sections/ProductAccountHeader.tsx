import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppIcon } from '@jujistu/ui';
import {
  selectResponsiveValue,
  type ResponsiveMetrics,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import {
  radius,
  semanticColors,
  spacing,
  typography,
} from '@jujistu/shared/theme';

const levelProgressImage = require('../../../../assets/app/level-progress.png');

export interface ProductAccountHeaderProps {
  avatar: ImageSourcePropType;
  username: string;
  level: string;
  primaryBalance: string;
  secondaryBalance: string;
}

interface BalancePillProps {
  icon: 'gem' | 'coin';
  value: string;
}

export function resolveBalanceGroupWidth(
  responsive: Pick<ResponsiveMetrics, 'sizeClass'>,
): number {
  return selectResponsiveValue(responsive, {
    compactPhone: 148,
    phone: 156,
    largePhone: 164,
    tablet: 172,
    largeTablet: 180,
  });
}

function BalancePill({ icon, value }: BalancePillProps) {
  return (
    <View style={styles.balancePill}>
      <View style={styles.balanceIcon}>
        <AppIcon name={icon} size={20} />
        <AppIcon name="balanceAdd" size={13.333} style={styles.addBadge} />
      </View>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.balanceText}>
        {value}
      </Text>
    </View>
  );
}

/**
 * Home account header. HomeScreen owns the top safe-area inset and supplies the
 * account data; this section is intentionally display-only.
 */
export function ProductAccountHeader({
  avatar,
  username,
  level,
  primaryBalance,
  secondaryBalance,
}: ProductAccountHeaderProps) {
  const responsive = useResponsive();
  const balanceGroupWidth = resolveBalanceGroupWidth(responsive);

  return (
    <View style={styles.container}>
      <View style={styles.profileGroup}>
        <View style={styles.levelSurface}>
          <Image
            source={levelProgressImage}
            resizeMode="stretch"
            style={styles.levelProgress}
            accessible={false}
            importantForAccessibility="no"
          />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.levelText}>
            {level}
          </Text>
        </View>

        <View style={styles.avatarGroup}>
          <Image source={avatar} resizeMode="cover" style={styles.avatar} />
          <View style={styles.settingsAccessory}>
            <AppIcon name="settings" size={12} />
          </View>
        </View>

        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>
          {username}
        </Text>
      </View>

      <View style={[styles.balanceGroup, { width: balanceGroupWidth }]}>
        <BalancePill icon="gem" value={primaryBalance} />
        <BalancePill icon="coin" value={secondaryBalance} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
    backgroundColor: '#030003',
  },
  profileGroup: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 161,
    maxWidth: 161,
    minWidth: 0,
    height: 48,
    overflow: 'hidden',
  },
  avatarGroup: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 52,
    height: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
  },
  settingsAccessory: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191919',
  },
  username: {
    ...typography.heading.sm,
    position: 'absolute',
    top: 6,
    left: 56,
    right: 0,
    color: semanticColors.text.primary,
  },
  levelSurface: {
    position: 'absolute',
    top: 31,
    left: 27,
    width: 134,
    height: 15,
    overflow: 'hidden',
    borderBottomRightRadius: radius.lg,
    backgroundColor: '#141414',
  },
  levelProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 86,
    height: 15,
  },
  levelText: {
    ...typography.heading.xs,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 134,
    height: 15,
    paddingHorizontal: spacing[2],
    color: semanticColors.text.primary,
    textAlign: 'center',
  },
  balanceGroup: {
    height: 28,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  balancePill: {
    flex: 1,
    minWidth: 0,
    height: 28,
    paddingTop: spacing[2],
    paddingRight: spacing[8],
    paddingBottom: spacing[2],
    paddingLeft: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  balanceIcon: {
    width: 20,
    height: 20,
    flexShrink: 0,
  },
  addBadge: {
    position: 'absolute',
    right: -4.1665,
    bottom: -4.1665,
  },
  balanceText: {
    ...typography.heading.xs,
    minWidth: 0,
    flexShrink: 1,
    color: semanticColors.text.primary,
  },
});
