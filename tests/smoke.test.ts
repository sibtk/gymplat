import { describe, it, expect } from "vitest";
import { ok, err, unwrap, createMoney, formatMoney, createEmail } from "@gym/shared-kernel";

describe("Smoke tests — shared-kernel", () => {
  describe("Result type", () => {
    it("creates a success result", () => {
      const result = ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(42);
      }
    });

    it("creates an error result", () => {
      const result = err(new Error("something failed"));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe("something failed");
      }
    });

    it("unwraps a success result", () => {
      const result = ok("hello");
      expect(unwrap(result)).toBe("hello");
    });

    it("throws when unwrapping an error result", () => {
      const result = err(new Error("fail"));
      expect(() => unwrap(result)).toThrow("fail");
    });
  });

  describe("Money value object", () => {
    it("creates money from cents", () => {
      const money = createMoney(4999);
      expect(money.amountCents).toBe(4999);
      expect(money.currency).toBe("usd");
    });

    it("formats money to USD string", () => {
      const money = createMoney(4999);
      expect(formatMoney(money)).toBe("$49.99");
    });

    it("rejects negative amounts", () => {
      expect(() => createMoney(-100)).toThrow();
    });
  });

  describe("Email value object", () => {
    it("normalizes email to lowercase", () => {
      const email = createEmail("User@Example.COM");
      expect(email).toBe("user@example.com");
    });

    it("rejects invalid emails", () => {
      expect(() => createEmail("not-an-email")).toThrow();
    });
  });
});
