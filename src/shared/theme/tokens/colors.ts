export const primitiveColors = {
  neutral: {
    0: '#FFFFFF',
    50: '#E3E3E3',
    100: '#C2C2C2',
    200: '#9E9E9E',
    300: '#7D7F84',
    550: '#434343',
    600: '#3D3D3D',
    650: '#323232',
    700: '#2C2C2C',
    750: '#292929',
    800: '#222222',
    825: '#1C1C1C',
    850: '#191919',
    900: '#0C0C0C',
    1000: '#000000',
  },

  red: {
    400: '#FF3A5E',
    500: '#BA2025',
    700: '#A70100',
    900: '#2E0709',
  },

  orange: {
    300: '#FFB877',
    500: '#FE8B33',
    900: '#35190A',
  },

  ember: {
    600: '#E8541F',
  },

  gi: {
    100: '#EFEAE1',
    300: '#CFC7BA',
  },

  belt: {
    white: '#EFEAE1',
    blue: '#2F5DA8',
    purple: '#6C3FA3',
    brown: '#6E4529',
    black: '#0A0A0A',
    barColor: '#D42A1E',
    barDefault: '#0A0A0A',
  },

  alpha: {
    white04: 'rgba(255, 255, 255, 0.04)',
    white06: 'rgba(255, 255, 255, 0.06)',
    white10: 'rgba(255, 255, 255, 0.10)',
    white14: 'rgba(255, 255, 255, 0.14)',
    white24: 'rgba(255, 255, 255, 0.24)',
    black40: 'rgba(0, 0, 0, 0.40)',
    black80: 'rgba(0, 0, 0, 0.80)',
    orange16: 'rgba(255, 138, 46, 0.16)',
    orange55: 'rgba(255, 138, 46, 0.55)',
    red24: 'rgba(212, 42, 30, 0.24)',
  },
} as const;

export type PrimitiveColors = typeof primitiveColors;
