"use client";

import { motion } from "framer-motion";

import type { BookingService } from "@/components/booking/service-step";
import type { BookingBarber } from "@/components/booking/barber-step";
import type { BookingSlot } from "@/components/booking/date-step";

const EASE = [0.22, 1, 0.36, 1] as const;

type BookingConfirmationProps = {
  service: BookingService;
  barber: BookingBarber | null;
  date: string;
  slot: BookingSlot;
  customerName: string;
  appointmentId?: string;
  onClose?: () => void;
};

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

export function BookingConfirmation({
  service,
  barber,
  date,
  slot,
  customerName,
  appointmentId,
  onClose,
}: BookingConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative overflow-hidden"
    >
      {/* Decorative editorial mark */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.15,
          ease: EASE,
        }}
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-brass/20"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.25,
          ease: EASE,
        }}
        className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-brass/10"
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: EASE,
          }}
          className="max-w-2xl"
        >
          <p className="text-eyebrow mb-6 text-terracotta">
            Reservation received
          </p>

          <h1 className="text-editorial text-5xl text-ink sm:text-6xl lg:text-8xl">
            You&apos;re on the
            <br />
            <span className="text-terracotta">
              list, {customerName.split(" ")[0]}.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-7 text-smoke sm:text-base">
            Your reservation has been received. We&apos;ll
            confirm your chair shortly and keep you updated
            with the details.
          </p>
        </motion.div>

        {/* Reservation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: EASE,
          }}
          className="mt-16 grid overflow-hidden bg-midnight-oak text-parchment md:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Main details */}
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/10" />

            <div className="relative">
              <div className="mb-10 flex items-center justify-between border-b border-parchment/10 pb-5">
                <p className="text-eyebrow text-parchment/40">
                  Your reservation
                </p>

                <span className="text-[10px] tracking-[0.16em] text-brass">
                  VAREL
                </span>
              </div>

              <div className="space-y-8">
                <ReservationItem
                  label="Service"
                  value={service.name}
                  detail={`${service.durationMinutes} min`}
                />

                <ReservationItem
                  label="Artisan"
                  value={barber?.name ?? "Any artisan"}
                  detail={barber?.role ?? undefined}
                />

                <ReservationItem
                  label="Date"
                  value={formatDate(date)}
                />

                <ReservationItem
                  label="Time"
                  value={`${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col justify-between bg-terracotta p-8 sm:p-10 lg:p-12">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-parchment/40">
                <motion.svg
                  initial={{
                    pathLength: 0,
                  }}
                  animate={{
                    pathLength: 1,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.5,
                    ease: EASE,
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M5 12.5L9.5 17L19 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </div>

              <p className="text-eyebrow text-parchment/60">
                Status
              </p>

              <p className="mt-3 font-display text-3xl text-parchment">
                Pending confirmation
              </p>

              <p className="mt-5 text-sm leading-6 text-parchment/70">
                Our team will review your reservation and
                confirm your chair.
              </p>
            </div>

            <div className="mt-12 border-t border-parchment/20 pt-7">
              <div className="flex items-end justify-between gap-4">
                <span className="text-label text-parchment/60">
                  Total
                </span>

                <span className="font-display text-2xl text-parchment">
                  {currency.format(service.price)}
                </span>
              </div>

              {appointmentId && (
                <p className="mt-5 text-[10px] uppercase tracking-[0.12em] text-parchment/40">
                  Reference · {appointmentId.slice(0, 8)}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.5,
            ease: EASE,
          }}
          className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-md text-xs leading-5 text-smoke">
            Please arrive a few minutes before your
            appointment. All times are shown in Lagos time.
          </p>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="group text-label text-ink"
            >
              <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover:border-terracotta group-hover:text-terracotta">
                Return to VAREL
              </span>
              <span className="ml-3 inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

type ReservationItemProps = {
  label: string;
  value: string;
  detail?: string;
};

function ReservationItem({
  label,
  value,
  detail,
}: ReservationItemProps) {
  return (
    <div>
      <p className="text-eyebrow mb-2 text-parchment/35">
        {label}
      </p>

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-display text-xl leading-tight text-parchment">
          {value}
        </p>

        {detail && (
          <span className="text-[10px] uppercase tracking-[0.12em] text-parchment/40">
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}