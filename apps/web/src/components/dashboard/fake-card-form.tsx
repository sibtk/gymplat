"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formatCardNumber, formatExpiry, getCardBrand, validateCardNumber } from "@/lib/utils";

import type { CardBrand } from "@/lib/types";

const cardSchema = z.object({
  cardNumber: z.string().refine((val) => validateCardNumber(val.replace(/\s/g, "")), "Invalid card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "MM/YY format"),
  cvc: z.string().min(3, "Required").max(4),
  nameOnCard: z.string().min(2, "Required"),
});

export type CardFormValues = z.infer<typeof cardSchema>;

const brandLabels: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  discover: "Discover",
  unknown: "",
};

interface FakeCardFormProps {
  onSubmit: (data: CardFormValues) => void;
  submitLabel?: string;
  defaultValues?: Partial<CardFormValues>;
}

export function FakeCardForm({ onSubmit, submitLabel = "Save Card", defaultValues }: FakeCardFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues,
  });

  const cardNumber = watch("cardNumber") ?? "";
  const brand = getCardBrand(cardNumber.replace(/\s/g, ""));
  const inputClass =
    "w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark";

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-peec-dark">Card Number</label>
        <div className="relative">
          <input
            {...register("cardNumber")}
            className={inputClass}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            onChange={(e) => setValue("cardNumber", formatCardNumber(e.target.value), { shouldValidate: false })}
          />
          {brand !== "unknown" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-medium text-peec-text-secondary">
              {brandLabels[brand]}
            </span>
          )}
        </div>
        {errors.cardNumber && <p className="mt-1 text-2xs text-red-500">{errors.cardNumber.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-peec-dark">Expiry</label>
          <input
            {...register("expiry")}
            className={inputClass}
            placeholder="MM/YY"
            maxLength={5}
            onChange={(e) => setValue("expiry", formatExpiry(e.target.value), { shouldValidate: false })}
          />
          {errors.expiry && <p className="mt-1 text-2xs text-red-500">{errors.expiry.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-peec-dark">CVC</label>
          <input
            {...register("cvc")}
            className={inputClass}
            placeholder={brand === "amex" ? "1234" : "123"}
            maxLength={brand === "amex" ? 4 : 3}
          />
          {errors.cvc && <p className="mt-1 text-2xs text-red-500">{errors.cvc.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-peec-dark">Name on Card</label>
        <input {...register("nameOnCard")} className={inputClass} placeholder="John Doe" />
        {errors.nameOnCard && <p className="mt-1 text-2xs text-red-500">{errors.nameOnCard.message}</p>}
      </div>
      <button type="submit" className="w-full rounded-lg bg-peec-dark py-2 text-xs font-medium text-white hover:bg-stone-800">
        {submitLabel}
      </button>
    </form>
  );
}
