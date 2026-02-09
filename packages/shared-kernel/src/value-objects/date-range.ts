import { z } from "zod";

export const DateRangeSchema = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .refine((data) => data.start < data.end, {
    message: "Start date must be before end date",
  });

export type DateRange = z.infer<typeof DateRangeSchema>;

export function createDateRange(start: Date, end: Date): DateRange {
  return DateRangeSchema.parse({ start, end });
}

export function isWithinRange(date: Date, range: DateRange): boolean {
  return date >= range.start && date <= range.end;
}
