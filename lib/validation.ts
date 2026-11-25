// Shared input checks for Server Actions. Form values arrive as
// FormDataEntryValue | null (or anything, from a direct action call), so
// every reader accepts `unknown` and returns null when the value is unusable.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A trimmed email address of at most 254 characters, or null. */
export function readEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim();
  return email.length <= 254 && emailPattern.test(email) ? email : null;
}

/**
 * Optional free text, trimmed. Missing values become "". Returns null when
 * the value isn't a string or is longer than `max` characters.
 */
export function readText(value: unknown, max: number): string | null {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length <= max ? text : null;
}

/** Log a failed Supabase call without personal data (codes only). */
export function logDatabaseError(
  context: string,
  error: { code?: string; message?: string } | null,
) {
  if (error)
    console.error(`${context} failed`, {
      code: error.code,
      message: error.message,
    });
}
