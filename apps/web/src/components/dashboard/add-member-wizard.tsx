"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, CreditCard, User, FileText, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/dashboard/toast";
import { useGymStore } from "@/lib/store";
import { formatCardNumber, formatExpiry, generateId, getCardBrand, getInitials, validateCardNumber } from "@/lib/utils";

import type { CardBrand } from "@/lib/types";

// ─── Schemas ────────────────────────────────────────────────────

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  locationId: z.string().min(1, "Location is required"),
  emergencyContact: z.string().min(5, "Emergency contact is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().refine((val) => validateCardNumber(val.replace(/\s/g, "")), "Invalid card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "MM/YY format required"),
  cvc: z.string().min(3, "CVC required").max(4),
  nameOnCard: z.string().min(2, "Cardholder name required"),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;
type PaymentInfo = z.infer<typeof paymentSchema>;

// ─── Step labels ────────────────────────────────────────────────

const steps = [
  { label: "Personal Info", icon: User },
  { label: "Select Plan", icon: CreditCard },
  { label: "Payment", icon: CreditCard },
  { label: "Waiver", icon: FileText },
] as const;

// ─── Props ──────────────────────────────────────────────────────

interface AddMemberWizardProps {
  open: boolean;
  onClose: () => void;
}

export function AddMemberWizard({ open, onClose }: AddMemberWizardProps) {
  const [step, setStep] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalInfo | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [paymentData, setPaymentData] = useState<PaymentInfo | null>(null);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  const { toast } = useToast();
  const plans = useGymStore((s) => s.plans);
  const locations = useGymStore((s) => s.locations);
  const addMember = useGymStore((s) => s.addMember);
  const addSubscription = useGymStore((s) => s.addSubscription);
  const addPaymentMethod = useGymStore((s) => s.addPaymentMethod);
  const addInvoice = useGymStore((s) => s.addInvoice);
  const addTransaction = useGymStore((s) => s.addTransaction);
  const addActivityEvent = useGymStore((s) => s.addActivityEvent);

  const handleClose = () => {
    setStep(0);
    setPersonalData(null);
    setSelectedPlanId(null);
    setPaymentData(null);
    setWaiverAccepted(false);
    setTermsAccepted(false);
    setSignatureName("");
    onClose();
  };

  const handleSubmit = () => {
    if (!personalData || !selectedPlanId || !paymentData) return;

    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return;

    const memberId = generateId("mem");
    const subscriptionId = generateId("sub");
    const paymentMethodId = generateId("pm");
    const invoiceId = generateId("inv");
    const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual;
    const tax = Math.round(price * 0.08 * 100) / 100;
    const digits = paymentData.cardNumber.replace(/\s/g, "");
    const now = new Date().toISOString();

    addMember({
      id: memberId,
      name: personalData.name,
      email: personalData.email,
      phone: personalData.phone,
      dateOfBirth: personalData.dateOfBirth,
      address: personalData.address,
      emergencyContact: personalData.emergencyContact,
      avatar: getInitials(personalData.name),
      locationId: personalData.locationId,
      planId: selectedPlanId,
      subscriptionId,
      paymentMethodId,
      status: "active",
      riskScore: 5,
      riskFactors: [],
      lastCheckIn: "Never",
      memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      waiverSigned: true,
      pausedUntil: null,
      cancelledAt: null,
      checkInHistory: [],
      tags: ["new-member"],
    });

    addSubscription({
      id: subscriptionId,
      memberId,
      memberName: personalData.name,
      planId: selectedPlanId,
      planName: plan.name,
      status: "active",
      billingCycle,
      amount: price,
      currentPeriodStart: now,
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now,
    });

    addPaymentMethod({
      id: paymentMethodId,
      memberId,
      memberName: personalData.name,
      type: "card",
      last4: digits.slice(-4),
      brand: getCardBrand(digits),
      expMonth: parseInt(paymentData.expiry.split("/")[0] as string, 10),
      expYear: 2000 + parseInt(paymentData.expiry.split("/")[1] as string, 10),
      isDefault: true,
    });

    addInvoice({
      id: invoiceId,
      memberId,
      memberName: personalData.name,
      amount: price,
      tax,
      total: Math.round((price + tax) * 100) / 100,
      status: "paid",
      lineItems: [{ description: `${plan.name} - ${billingCycle}`, quantity: 1, unitPrice: price, total: price }],
      issuedAt: now,
      dueAt: now,
      paidAt: now,
    });

    addTransaction({
      id: generateId("txn"),
      memberId,
      memberName: personalData.name,
      amount: Math.round((price + tax) * 100) / 100,
      type: "subscription",
      status: "completed",
      method: "card",
      description: `New membership: ${plan.name}`,
      invoiceId,
      refundReason: null,
      date: now,
    });

    addActivityEvent({
      id: generateId("evt"),
      type: "signup",
      description: `signed up for ${plan.name} plan`,
      timestamp: now,
      member: personalData.name,
    });

    toast(`${personalData.name} has been added successfully`);
    handleClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />
      <motion.div
        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div
          className="w-full max-w-2xl rounded-xl border border-peec-border-light bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-peec-border-light px-6 py-4">
            <h2 className="text-sm font-semibold text-peec-dark">Add New Member</h2>
            <button type="button" onClick={handleClose} className="rounded-lg p-1 text-peec-text-muted hover:bg-stone-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 border-b border-peec-border-light px-6 py-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                      i < step
                        ? "bg-green-100 text-green-700"
                        : i === step
                          ? "bg-peec-dark text-white"
                          : "bg-stone-100 text-peec-text-muted"
                    }`}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <span className={`hidden text-xs tablet:inline ${i === step ? "font-medium text-peec-dark" : "text-peec-text-muted"}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <div className="mx-2 hidden h-px w-8 bg-peec-border-light tablet:block" />}
                </div>
              );
            })}
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
              >
                {step === 0 && (
                  <PersonalInfoStep
                    locations={locations}
                    defaultValues={personalData}
                    onNext={(data) => {
                      setPersonalData(data);
                      setStep(1);
                    }}
                  />
                )}
                {step === 1 && (
                  <PlanSelectionStep
                    plans={plans}
                    selectedPlanId={selectedPlanId}
                    billingCycle={billingCycle}
                    onSelect={setSelectedPlanId}
                    onCycleChange={setBillingCycle}
                    onNext={() => setStep(2)}
                    onBack={() => setStep(0)}
                  />
                )}
                {step === 2 && (
                  <PaymentStep
                    defaultValues={paymentData}
                    onNext={(data) => {
                      setPaymentData(data);
                      setStep(3);
                    }}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <WaiverStep
                    waiverAccepted={waiverAccepted}
                    termsAccepted={termsAccepted}
                    signatureName={signatureName}
                    onWaiverChange={setWaiverAccepted}
                    onTermsChange={setTermsAccepted}
                    onSignatureChange={setSignatureName}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(2)}
                    canSubmit={waiverAccepted && termsAccepted && signatureName.length >= 2}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Step 1: Personal Info ──────────────────────────────────────

function PersonalInfoStep({
  locations,
  defaultValues,
  onNext,
}: {
  locations: { id: string; name: string }[];
  defaultValues: PersonalInfo | null;
  onNext: (data: PersonalInfo) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaultValues ?? undefined,
  });

  return (
    <form onSubmit={(e) => void handleSubmit(onNext)(e)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} placeholder="John Doe" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className={inputClass} placeholder="john@example.com" />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className={inputClass} placeholder="(555) 123-4567" />
        </Field>
        <Field label="Date of Birth" error={errors.dateOfBirth?.message}>
          <input {...register("dateOfBirth")} type="date" className={inputClass} />
        </Field>
      </div>
      <Field label="Address" error={errors.address?.message}>
        <input {...register("address")} className={inputClass} placeholder="123 Main St, New York, NY" />
      </Field>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <Field label="Location" error={errors.locationId?.message}>
          <select {...register("locationId")} className={inputClass}>
            <option value="">Select location...</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Emergency Contact" error={errors.emergencyContact?.message}>
          <input {...register("emergencyContact")} className={inputClass} placeholder="Name: (555) 999-0000" />
        </Field>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 2: Plan Selection ─────────────────────────────────────

function PlanSelectionStep({
  plans,
  selectedPlanId,
  billingCycle,
  onSelect,
  onCycleChange,
  onNext,
  onBack,
}: {
  plans: { id: string; name: string; priceMonthly: number; priceAnnual: number; features: string[]; type: string }[];
  selectedPlanId: string | null;
  billingCycle: "monthly" | "annual";
  onSelect: (id: string) => void;
  onCycleChange: (cycle: "monthly" | "annual") => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onCycleChange("monthly")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            billingCycle === "monthly" ? "bg-peec-dark text-white" : "bg-stone-100 text-peec-text-muted"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onCycleChange("annual")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            billingCycle === "annual" ? "bg-peec-dark text-white" : "bg-stone-100 text-peec-text-muted"
          }`}
        >
          Annual <span className="text-green-500">Save 17%</span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
        {plans.map((plan) => {
          const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual;
          const selected = selectedPlanId === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selected
                  ? "border-peec-dark bg-stone-50 ring-1 ring-peec-dark"
                  : "border-peec-border-light hover:border-peec-dark/30"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-peec-dark">{plan.name}</span>
                {selected && <Check className="h-4 w-4 text-peec-dark" />}
              </div>
              <p className="text-lg font-bold text-peec-dark">
                ${price.toFixed(2)}
                <span className="text-xs font-normal text-peec-text-muted">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </p>
              <ul className="mt-2 space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-2xs text-peec-text-secondary">
                    <Check className="h-3 w-3 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedPlanId}
          className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-40"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Payment ────────────────────────────────────────────

const brandLabels: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  discover: "Discover",
  unknown: "",
};

function PaymentStep({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: PaymentInfo | null;
  onNext: (data: PaymentInfo) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentInfo>({
    resolver: zodResolver(paymentSchema),
    defaultValues: defaultValues ?? undefined,
  });

  const cardNumber = watch("cardNumber") ?? "";
  const brand = getCardBrand(cardNumber.replace(/\s/g, ""));

  return (
    <form onSubmit={(e) => void handleSubmit(onNext)(e)} className="space-y-4">
      <div className="rounded-xl border border-peec-border-light bg-stone-50 p-4">
        <p className="mb-3 text-xs font-medium text-peec-text-muted">Card Details</p>
        <Field label="Card Number" error={errors.cardNumber?.message}>
          <div className="relative">
            <input
              {...register("cardNumber")}
              className={inputClass}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              onChange={(e) => {
                setValue("cardNumber", formatCardNumber(e.target.value), { shouldValidate: false });
              }}
            />
            {brand !== "unknown" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-medium text-peec-text-secondary">
                {brandLabels[brand]}
              </span>
            )}
          </div>
        </Field>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Expiry" error={errors.expiry?.message}>
            <input
              {...register("expiry")}
              className={inputClass}
              placeholder="MM/YY"
              maxLength={5}
              onChange={(e) => {
                setValue("expiry", formatExpiry(e.target.value), { shouldValidate: false });
              }}
            />
          </Field>
          <Field label="CVC" error={errors.cvc?.message}>
            <input
              {...register("cvc")}
              className={inputClass}
              placeholder={brand === "amex" ? "1234" : "123"}
              maxLength={brand === "amex" ? 4 : 3}
            />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Name on Card" error={errors.nameOnCard?.message}>
            <input {...register("nameOnCard")} className={inputClass} placeholder="John Doe" />
          </Field>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>
        <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-peec-dark px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 4: Waiver ─────────────────────────────────────────────

function WaiverStep({
  waiverAccepted,
  termsAccepted,
  signatureName,
  onWaiverChange,
  onTermsChange,
  onSignatureChange,
  onSubmit,
  onBack,
  canSubmit,
}: {
  waiverAccepted: boolean;
  termsAccepted: boolean;
  signatureName: string;
  onWaiverChange: (v: boolean) => void;
  onTermsChange: (v: boolean) => void;
  onSignatureChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  canSubmit: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="h-40 overflow-y-auto rounded-lg border border-peec-border-light bg-stone-50 p-4 text-xs leading-relaxed text-peec-text-secondary">
        <p className="mb-2 font-semibold text-peec-dark">Membership Agreement & Liability Waiver</p>
        <p>By signing this agreement, you acknowledge that you have voluntarily chosen to participate in physical exercise activities at our facility. You understand that physical exercise involves inherent risks, including but not limited to physical injury, and you assume all such risks.</p>
        <p className="mt-2">You agree to follow all facility rules and regulations, use equipment properly, and report any injuries or equipment malfunctions immediately. You release the gym, its owners, employees, and agents from any and all liability for injuries sustained during your use of the facility.</p>
        <p className="mt-2">You understand that your membership is subject to the terms outlined in your selected plan, including billing cycles, cancellation policies, and facility access hours. Monthly memberships require 30 days notice for cancellation.</p>
        <p className="mt-2">You confirm that you are in good physical health and have no medical conditions that would prevent safe exercise. If you have any health concerns, you agree to consult a physician before beginning any exercise program.</p>
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={waiverAccepted}
          onChange={(e) => onWaiverChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-peec-border-light"
        />
        <span className="text-xs text-peec-dark">I have read and agree to the Liability Waiver</span>
      </label>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-peec-border-light"
        />
        <span className="text-xs text-peec-dark">I accept the Terms of Service and Privacy Policy</span>
      </label>

      <Field label="Digital Signature (type your full name)">
        <input
          value={signatureName}
          onChange={(e) => onSignatureChange(e.target.value)}
          className={inputClass}
          placeholder="Type your full name"
          style={{ fontFamily: "cursive" }}
        />
      </Field>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 rounded-lg border border-peec-border-light px-4 py-2 text-xs font-medium text-peec-dark hover:bg-stone-50">
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="rounded-lg bg-peec-dark px-6 py-2 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-40"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
}

// ─── Shared UI ──────────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-peec-border-light px-3 py-2 text-sm text-peec-dark placeholder:text-peec-text-muted focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-peec-dark">{label}</label>
      {children}
      {error && <p className="mt-1 text-2xs text-red-500">{error}</p>}
    </div>
  );
}
