/**
 * Branded types for domain identifiers.
 * Prevents accidentally passing a MemberId where a GymId is expected.
 */

declare const brand: unique symbol;

type Brand<T, B extends string> = T & { readonly [brand]: B };

export type MemberId = Brand<string, "MemberId">;
export type GymId = Brand<string, "GymId">;
export type UserId = Brand<string, "UserId">;
export type StaffId = Brand<string, "StaffId">;
export type PlanId = Brand<string, "PlanId">;
export type SubscriptionId = Brand<string, "SubscriptionId">;
export type PaymentId = Brand<string, "PaymentId">;
export type CheckInId = Brand<string, "CheckInId">;

/**
 * Create a branded ID from a raw string.
 * Use at system boundaries (API responses, DB reads).
 */
export function createId<T extends Brand<string, string>>(raw: string): T {
  return raw as T;
}
