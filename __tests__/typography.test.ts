import { componentTypography, theme, typography } from '@jujistu/shared/theme';

describe('Typography Infrastructure', () => {
  it('exposes exact core heading typography values', () => {
    expect(typography.heading.lg).toEqual({
      fontFamily: expect.any(String),
      fontSize: 18,
      lineHeight: 23.4,
      fontWeight: '700',
      letterSpacing: -0.18,
    });
    expect(typography.heading.md).toEqual({
      fontFamily: expect.any(String),
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '700',
      letterSpacing: -0.16,
    });
    expect(typography.heading.sm).toEqual({
      fontFamily: expect.any(String),
      fontSize: 14,
      lineHeight: 19.6,
      fontWeight: '700',
      letterSpacing: -0.14,
    });
    expect(typography.heading.xs).toEqual({
      fontFamily: expect.any(String),
      fontSize: 12,
      lineHeight: 15,
      fontWeight: '700',
      letterSpacing: -0.12,
    });
  });

  it('exposes exact core body typography values', () => {
    expect(typography.body.md).toEqual({
      fontFamily: expect.any(String),
      fontSize: 14,
      lineHeight: 19.6,
      fontWeight: '400',
      letterSpacing: -0.14,
    });
    expect(typography.body.sm).toEqual({
      fontFamily: expect.any(String),
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400',
      letterSpacing: 0,
    });
  });

  it('exposes exact core label typography values', () => {
    expect(typography.label.lg).toEqual({
      fontFamily: expect.any(String),
      fontSize: 18,
      lineHeight: 27,
      fontWeight: '500',
      letterSpacing: 0,
    });
    expect(typography.label.md).toEqual({
      fontFamily: expect.any(String),
      fontSize: 14,
      lineHeight: 19.6,
      fontWeight: '500',
      letterSpacing: -0.14,
    });
    expect(typography.label.sm).toEqual({
      fontFamily: expect.any(String),
      fontSize: 12,
      lineHeight: 15,
      fontWeight: '500',
      letterSpacing: 0,
    });
  });

  it('exposes exact core caption typography values', () => {
    expect(typography.caption.sm).toEqual({
      fontFamily: expect.any(String),
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '500',
      letterSpacing: -0.1,
    });
    expect(typography.caption.xs).toEqual({
      fontFamily: expect.any(String),
      fontSize: 10,
      lineHeight: 10,
      fontWeight: '500',
      letterSpacing: -0.1,
    });
  });

  it('exposes exact component typography values', () => {
    expect(componentTypography.button).toEqual({
      fontFamily: expect.any(String),
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      letterSpacing: 0,
    });
    expect(componentTypography.inputPlaceholder).toEqual({
      fontFamily: expect.any(String),
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '400',
      letterSpacing: 0,
    });
  });

  it('guarantees typography styles DO NOT contain color properties', () => {
    const allStyles = [
      ...Object.values(typography.heading),
      ...Object.values(typography.body),
      ...Object.values(typography.label),
      ...Object.values(typography.caption),
      ...Object.values(componentTypography),
    ];

    allStyles.forEach(style => {
      expect((style as Record<string, unknown>).color).toBeUndefined();
    });
  });

  it('is integrated into composed theme object', () => {
    expect(theme.typography).toBe(typography);
    expect(theme.componentTypography).toBe(componentTypography);
  });
});
