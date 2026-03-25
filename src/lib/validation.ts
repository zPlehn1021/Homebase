/**
 * Parse and validate a route parameter as a positive integer.
 * Returns the parsed number or null if invalid.
 */
export function parseId(value: string): number | null {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0 || String(parsed) !== value) return null;
  return parsed;
}

/**
 * Validate a cost value (in cents). Must be a finite non-negative integer.
 * Returns the validated cost or null if invalid.
 */
export function validateCost(value: unknown): number | null {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0 || num > 999_999_999) return null;
  return Math.round(num);
}
