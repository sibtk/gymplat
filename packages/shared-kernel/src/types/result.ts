/**
 * Result type for operations that can fail.
 * Provides type-safe error handling without exceptions.
 */
export type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Unwrap a Result, throwing the error if it's a failure.
 * Use sparingly — prefer pattern matching with if/else.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.data;
  }
  throw result.error instanceof Error ? result.error : new Error(String(result.error));
}
