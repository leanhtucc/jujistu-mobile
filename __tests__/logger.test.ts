import { redactSensitiveValues } from '@jujistu/shared/logger/redact';

describe('redactSensitiveValues', () => {
  it('redacts Bearer tokens', () => {
    const input = 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';
    const result = redactSensitiveValues(input);

    expect(result).toBe('Authorization: Bearer ***');
    expect(result).not.toContain('eyJ');
  });

  it('redacts Basic auth tokens', () => {
    const input = 'Basic dXNlcjpwYXNzd29yZA==';
    const result = redactSensitiveValues(input);

    expect(result).toBe('Basic ***');
  });

  it('redacts password key-value pairs', () => {
    const input = 'password=s3cret123 confirmed';
    const result = redactSensitiveValues(input);

    expect(result).toContain('password=***');
    expect(result).not.toContain('s3cret123');
  });

  it('redacts token key-value pairs', () => {
    const input = 'refresh_token=abc123xyz';
    const result = redactSensitiveValues(input);

    expect(result).toContain('refresh_token=***');
    expect(result).not.toContain('abc123xyz');
  });

  it('redacts api_key key-value pairs', () => {
    const input = 'api_key=sk_live_abc123';
    const result = redactSensitiveValues(input);

    expect(result).toContain('api_key=***');
    expect(result).not.toContain('sk_live_abc123');
  });

  it('partially redacts email addresses', () => {
    const input = 'User email: john.doe@example.com logged in';
    const result = redactSensitiveValues(input);

    expect(result).toContain('j***@example.com');
    expect(result).not.toContain('john.doe@example.com');
  });

  it('preserves the email domain', () => {
    const result = redactSensitiveValues('contact: a@test.org');

    expect(result).toContain('@test.org');
  });

  it('returns non-sensitive messages unchanged', () => {
    const input = 'User navigated to Home screen';

    expect(redactSensitiveValues(input)).toBe(input);
  });

  it('handles multiple sensitive values in one message', () => {
    const input = 'Bearer tok123 password=abc user@mail.com';
    const result = redactSensitiveValues(input);

    expect(result).not.toContain('tok123');
    expect(result).not.toContain('abc');
    expect(result).not.toContain('user@mail.com');
  });
});
