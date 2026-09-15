export const primitiveColors = {
  neutral: {
    0: '#FFFFFF',
    50: '#E3E3E3',
    100: '#C2C2C2',
    200: '#9E9E9E',
    300: '#7D7F84',
    600: '#3D3D3D',
    700: '#2C2C2C',
    750: '#292929',
    800: '#222222',
    850: '#191919',
    900: '#0C0C0C',
    1000: '#000000',
  },

  red: {
    400: '#FF3A5E',
    500: '#BA2025',
  },

  orange: {
    500: '#FE8B33',
  },

  alpha: {
    white10: 'rgba(255, 255, 255, 0.10)',
    black80: 'rgba(0, 0, 0, 0.80)',
  },
} as const;

export type PrimitiveColors = typeof primitiveColors;
