import { createLogger } from '@jujistu/shared/logger/logger';
import React, {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Image, StyleSheet, View } from 'react-native';

const background = require('../../../../assets/image/backgrounds/bg_login.png');
const log = createLogger('AuthBackground');

type AuthBackgroundProps = PropsWithChildren<{
  dimmed?: boolean;
  onReady?: () => void;
}>;

export function AuthBackground({
  children,
  dimmed = false,
  onReady,
}: AuthBackgroundProps) {
  const [backgroundSettled, setBackgroundSettled] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);

  useEffect(() => {
    if (backgroundSettled && hasLayout) {
      onReady?.();
    }
  }, [backgroundSettled, hasLayout, onReady]);

  const handleImageError = useCallback(() => {
    log.error('Authentication background failed to load');
    setBackgroundSettled(true);
  }, []);

  return (
    <View onLayout={() => setHasLayout(true)} style={styles.background}>
      <Image
        accessibilityIgnoresInvertColors
        fadeDuration={0}
        onError={handleImageError}
        onLoad={() => setBackgroundSettled(true)}
        resizeMode="cover"
        source={background}
        style={styles.image}
      />
      {dimmed ? <View pointerEvents="none" style={styles.dim} /> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000000',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  dim: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  image: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
