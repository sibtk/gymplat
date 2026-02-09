import { z } from "zod";

export const EmailSchema = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

export type Email = z.infer<typeof EmailSchema>;

export function createEmail(raw: string): Email {
  return EmailSchema.parse(raw);
}
