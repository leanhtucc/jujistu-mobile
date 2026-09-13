const REDACTION_PLACEHOLDER = '***';

/**
 * Patterns that match sensitive values in log output.
 *
 * Each entry replaces recognizable credential or PII fragments with a fixed
 * placeholder so that structured or free-form messages never leak secrets to
 * console, crash reporters, or log aggregation services.
 */
const SENSITIVE_PATTERNS: ReadonlyArray<{
  label: string;
  pattern: RegExp;
  replacement: string;
}> = [
  // Authorization header values: "Bearer <token>", "Basic <token>"
  {
    label: 'authorization',
    pattern: /\b(Bearer|Basic)\s+\S+/gi,
    replacement: `$1 ${REDACTION_PLACEHOLDER}`,
  },
  // Key-value pairs where the key suggests a secret
  {
    label: 'key-value secret',
    pattern:
      /(password|secret|token|api[_-]?key|access[_-]?key|refresh[_-]?token)[=:]\s*\S+/gi,
    replacement: `$1=${REDACTION_PLACEHOLDER}`,
  },
  // Email addresses — partial redaction: first char + ***@domain
  {
    label: 'email',
    pattern:
      /\b([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    replacement: `$1${REDACTION_PLACEHOLDER}@$3`,
  },
];

/**
 * Replace sensitive patterns in {@link message} with redacted placeholders.
 *
 * The function is intentionally side-effect-free and safe to call from any
 * thread or context. Unknown input types are coerced to their string
 * representation before scanning.
 */
export function redactSensitiveValues(message: string): string {
  let result = message;

  for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  return result;
}
