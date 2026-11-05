import React, { useCallback, useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';

/**
 * Pressable whose style may be a function of the pressed state.
 *
 * NativeWind wraps `Pressable` and drops a style *function* on device, so every
 * border, background and layout rule written that way silently disappears. This
 * wrapper resolves the function itself and hands `Pressable` a plain style.
 */
export function AppPressable({
  style,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps) {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    event => {
      setPressed(true);
      onPressIn?.(event);
    },
    [onPressIn],
  );
  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    event => {
      setPressed(false);
      onPressOut?.(event);
    },
    [onPressOut],
  );

  const state = { pressed, hovered: false, focused: false };
  const resolvedStyle = typeof style === 'function' ? style(state) : style;
  const resolvedChildren =
    typeof children === 'function' ? children(state) : children;

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={resolvedStyle}
    >
      {resolvedChildren}
    </Pressable>
  );
}
