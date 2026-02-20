import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { CardBrand } from "@/lib/types";
import type { ClassValue } from "clsx";

// ─── Class Names ────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── ID Generation ──────────────────────────────────────────────

let counter = 0;

export function generateId(prefix = "id"): string {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

// ─── Currency ───────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ─── Date ───────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(iso: string): string {
  const now = Date.now();
  const date = new Date(iso).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

// ─── Card Validation ────────────────────────────────────────────

export function validateCardNumber(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i] as string, 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const brand = getCardBrand(digits);
  if (brand === "amex") {
    // AMEX: 4-6-5
    return digits
      .slice(0, 15)
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_m, a: string, b: string, c: string) =>
        [a, b, c].filter(Boolean).join(" "),
      );
  }
  // Default: 4-4-4-4
  return digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function getCardBrand(num: string): CardBrand {
  const digits = num.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(?:011|5)/.test(digits)) return "discover";
  return "unknown";
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

// ─── Initials ───────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
