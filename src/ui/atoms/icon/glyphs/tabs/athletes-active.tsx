import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { GlyphProps } from '../../icon.types';

export function AthletesActiveGlyph({ size, color }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM6.3 7.8C7.1 7.2 8.1 7 9.2 7H14.8C15.9 7 16.9 7.2 17.7 7.8L19.5 9.2C20.1 9.7 20.2 10.6 19.7 11.2C19.2 11.8 18.3 11.9 17.7 11.4L16 10.1V14.5L18.4 18.2C18.8 18.8 18.6 19.7 18 20.1C17.4 20.5 16.5 20.3 16.1 19.7L13.5 15.6H10.5L7.9 19.7C7.5 20.3 6.6 20.5 6 20.1C5.4 19.7 5.2 18.8 5.6 18.2L8 14.5V10.1L6.3 11.4C5.7 11.9 4.8 11.8 4.3 11.2C3.8 10.6 3.9 9.7 4.5 9.2L6.3 7.8Z"
        fill={color}
      />
    </Svg>
  );
}
