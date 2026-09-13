const { transformSync } = require('@babel/core');

const inlineJujistuEnvironment = require('../scripts/babel-plugin-inline-jujistu-environment');

describe('inline JUJISTU environment Babel plugin', () => {
  it('replaces only the allowlisted environment expression', () => {
    const result = transformSync(
      'const selected = process.env.JUJISTU_ENV; const untouched = process.env.OTHER_VALUE;',
      {
        configFile: false,
        plugins: [[inlineJujistuEnvironment, { environment: 'staging' }]],
      },
    );

    expect(result?.code).toContain('const selected = "staging";');
    expect(result?.code).toContain('process.env.OTHER_VALUE');
  });

  it('requires an explicit environment option', () => {
    expect(() =>
      transformSync('const selected = process.env.JUJISTU_ENV;', {
        configFile: false,
        plugins: [[inlineJujistuEnvironment, {}]],
      }),
    ).toThrow('environment option is required');
  });
});
