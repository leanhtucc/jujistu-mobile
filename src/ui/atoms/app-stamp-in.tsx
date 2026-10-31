import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { motionDuration } from '@jujistu/shared/theme';

export interface StampInProps {
  readonly children: React.ReactNode;
  /** Delay before the stamp lands, in milliseconds. */
  readonly delay?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

const START_SCALE = 1.9;
const START_ROTATION_DEG = -15;

/**
 * Lands its child like a rubber stamp: it starts large and crooked, then
 * snaps to rest with a spring. Overshoot is allowed here by the design system.
 * With "reduce motion" on, the child simply appears.
 */
export function AppStampIn({
  children,
  delay = 0,
  style,
  testID = 'app-stamp-in',
}: StampInProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    let animation: Animated.CompositeAnimation | null = null;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduceMotion => {
        if (cancelled) {
          return;
        }
        if (reduceMotion) {
          progress.setValue(1);
          return;
        }
        animation = Animated.sequence([
          Animated.delay(delay),
          Animated.spring(progress, {
            bounciness: 12,
            speed: 14,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]);
        animation.start();
      })
      .catch(() => progress.setValue(1));

    return () => {
      cancelled = true;
      animation?.stop();
    };
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress.interpolate({
            inputRange: [0, 0.25, 1],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [START_SCALE, 1],
              }),
            },
            {
              rotate: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [`${START_ROTATION_DEG}deg`, '0deg'],
              }),
            },
          ],
        },
      ]}
      testID={testID}
    >
      {children}
    </Animated.View>
  );
}

/** Duration the stamp is expected to take, for callers that sequence UI. */
export const STAMP_IN_DURATION_MS = motionDuration.sweep;
