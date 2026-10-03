"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { BookingService } from "@/components/booking/service-step";
import type { BookingBarber } from "@/components/booking/barber-step";
import type { BookingSlot } from "@/components/booking/date-step";

const EASE = [0.22, 1, 0.36, 1] as const;

type DetailsStepProps = {
  service: BookingService;
  barber: BookingBarber | null;
  date: string;
  slot: BookingSlot;
  onSubmit: (details: CustomerDetails) => Promise<void> | void;
  onBack?: () => void;
  isSubmitting?: boolean;
};

export type CustomerDetails = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
};

type FieldErrors = Partial<
  Record<keyof CustomerDetails, string>
>;

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function validateDetails(
  details: CustomerDetails,
): FieldErrors {
  const errors: FieldErrors = {};

  if (details.customerName.trim().length < 2) {
    errors.customerName = "Please enter your name.";
  }

  if (
    !details.customerEmail.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      details.customerEmail.trim(),
    )
  ) {
    errors.customerEmail =
      "Please enter a valid email address.";
  }

  if (details.customerPhone.trim().length < 7) {
    errors.customerPhone =
      "Please enter a valid phone number.";
  }

  if (details.customerNotes.trim().length > 1000) {
    errors.customerNotes =
      "Notes must be less than 1000 characters.";
  }

  return errors;
}

export function DetailsStep({
  service,
  barber,
  date,
  slot,
  onSubmit,
  onBack,
  isSubmitting = false,
}: DetailsStepProps) {
  const [details, setDetails] = useState<CustomerDetails>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerNotes: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  function updateField(
    field: keyof CustomerDetails,
    value: string,
  ) {
    setDetails((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors = validateDetails(details);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      customerName: details.customerName.trim(),
      customerEmail: details.customerEmail.trim(),
      customerPhone: details.customerPhone.trim(),
      customerNotes:
        details.customerNotes?.trim() || undefined,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-24"
    >
      {/* Form */}
      <div>
        <div className="mb-12 max-w-2xl">
          <p className="text-eyebrow mb-5 text-terracotta">
            Almost there
          </p>

          <h2 className="text-editorial text-5xl tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
            Make it yours.
          </h2>

          <p className="mt-7 max-w-lg text-sm leading-7 text-smoke sm:text-base">
            A few details before your chair is ready.
            We&apos;ll use them to confirm your appointment
            and keep you informed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl"
        >
          <div className="grid gap-9 sm:grid-cols-2">
            <EditorialField
              label="Your name"
              name="customerName"
              value={details.customerName}
              onChange={(value) =>
                updateField("customerName", value)
              }
              error={errors.customerName}
              placeholder="John Doe"
              autoComplete="name"
              disabled={isSubmitting}
            />

            <EditorialField
              label="Phone number"
              name="customerPhone"
              type="tel"
              value={details.customerPhone}
              onChange={(value) =>
                updateField("customerPhone", value)
              }
              error={errors.customerPhone}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
              disabled={isSubmitting}
            />

            <div className="sm:col-span-2">
              <EditorialField
                label="Email address"
                name="customerEmail"
                type="email"
                value={details.customerEmail}
                onChange={(value) =>
                  updateField("customerEmail", value)
                }
                error={errors.customerEmail}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="customerNotes"
                className="text-label mb-3 block text-smoke"
              >
                Anything we should know?
                <span className="ml-2 normal-case tracking-normal text-smoke/60">
                  Optional
                </span>
              </label>

              <textarea
                id="customerNotes"
                name="customerNotes"
                value={details.customerNotes}
                onChange={(event) =>
                  updateField(
                    "customerNotes",
                    event.target.value,
                  )
                }
                placeholder="A preference, request, or note for your barber."
                rows={4}
                maxLength={1000}
                disabled={isSubmitting}
                className="w-full resize-none border-b border-ink/20 bg-transparent px-0 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-terracotta disabled:cursor-not-allowed disabled:opacity-50"
              />

              <div className="mt-2 flex justify-between">
                <AnimatePresence mode="wait">
                  {errors.customerNotes ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-terracotta"
                    >
                      {errors.customerNotes}
                    </motion.p>
                  ) : (
                    <span />
                  )}
                </AnimatePresence>

                <span className="text-[10px] tracking-[0.12em] text-smoke/50">
                  {details.customerNotes?.length ?? 0}/1000
                </span>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col-reverse gap-4 border-t border-ink/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="group flex items-center gap-3 self-start text-label text-smoke transition-colors hover:text-ink disabled:opacity-40"
              >
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1">
                  ←
                </span>
                Back
              </button>
            ) : (
              <span />
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { y: -2 } : undefined}
              whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
              transition={{ duration: 0.4, ease: EASE }}
              className="group relative inline-flex min-h-14 items-center justify-center gap-5 overflow-hidden bg-terracotta px-7 text-label text-parchment transition-colors duration-500 hover:bg-burnt-amber disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {isSubmitting
                  ? "Reserving your chair..."
                  : "Reserve my chair"}
              </span>

              {!isSubmitting && (
                <span className="text-base transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                  →
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Reservation manifest */}
      <aside className="lg:pt-24">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: EASE,
          }}
          className="relative overflow-hidden bg-midnight-oak px-7 py-8 text-parchment sm:px-9 sm:py-10"
        >
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/20" />
          <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-1/2 translate-y-1/2 rounded-full border border-terracotta/20" />

          <div className="relative">
            <div className="mb-9 flex items-center justify-between border-b border-parchment/10 pb-5">
              <p className="text-eyebrow text-parchment/50">
                Your reservation
              </p>

              <span className="text-[10px] tracking-[0.14em] text-brass">
                VAREL
              </span>
            </div>

            <div className="space-y-7">
              <ManifestItem
                label="Service"
                value={service.name}
                detail={`${service.durationMinutes} min`}
              />

              <ManifestItem
                label="Artisan"
                value={barber?.name ?? "Any artisan"}
                detail={barber?.role ?? undefined}
              />

              <ManifestItem
                label="Date"
                value={formatDate(date)}
              />

              <ManifestItem
                label="Time"
                value={`${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`}
              />
            </div>

            <div className="mt-9 border-t border-parchment/10 pt-7">
              <div className="flex items-end justify-between gap-4">
                <span className="text-label text-parchment/40">
                  Total
                </span>

                <span className="font-display text-2xl text-parchment">
                  {currency.format(service.price)}
                </span>
              </div>
            </div>

            <p className="mt-8 text-[11px] leading-5 text-parchment/40">
              Your appointment will be held as pending until
              confirmed by VAREL.
            </p>
          </div>
        </motion.div>

        <p className="mt-5 text-center text-[10px] uppercase tracking-[0.16em] text-smoke/60">
          All times shown in Lagos time
        </p>
      </aside>
    </motion.div>
  );
}

type EditorialFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  disabled?: boolean;
};

function EditorialField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
  disabled,
}: EditorialFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-label mb-3 block text-smoke"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${name}-error` : undefined
        }
        className={`w-full border-b bg-transparent px-0 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-terracotta"
            : "border-ink/20 focus:border-terracotta"
        }`}
      />

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${name}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-xs text-terracotta"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

type ManifestItemProps = {
  label: string;
  value: string;
  detail?: string;
};

function ManifestItem({
  label,
  value,
  detail,
}: ManifestItemProps) {
  return (
    <div>
      <p className="text-eyebrow mb-2 text-parchment/35">
        {label}
      </p>

      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-lg leading-tight text-parchment">
          {value}
        </p>

        {detail && (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-parchment/40">
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}