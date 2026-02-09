import { z } from "zod";

/**
 * Money value object — always stored as cents to avoid floating point issues.
 * All Stripe amounts are in cents.
 */
export const MoneySchema = z.object({
  amountCents: z.number().int().nonnegative(),
  currency: z.enum(["usd"]).default("usd"),
});

export type Money = z.infer<typeof MoneySchema>;

export function createMoney(amountCents: number, currency: "usd" = "usd"): Money {
  return MoneySchema.parse({ amountCents, currency });
}

export function formatMoney(money: Money): string {
  const dollars = money.amountCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency.toUpperCase(),
  }).format(dollars);
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add different currencies: ${String(a.currency)} and ${String(b.currency)}`);
  }
  return createMoney(a.amountCents + b.amountCents, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract different currencies: ${String(a.currency)} and ${String(b.currency)}`);
  }
  return createMoney(a.amountCents - b.amountCents, a.currency);
}
