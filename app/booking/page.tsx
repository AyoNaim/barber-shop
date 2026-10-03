"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  BookingProgress,
  type BookingStep,
} from "@/components/booking/booking-progress";
import {
  ServiceStep,
  type BookingService,
} from "@/components/booking/service-step";
import {
  BarberStep,
  type BookingBarber,
} from "@/components/booking/barber-step";
import {
  DateStep,
  type BookingSlot,
} from "@/components/booking/date-step";
import {
  DetailsStep,
  type CustomerDetails,
} from "@/components/booking/details-step";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";

const EASE = [0.22, 1, 0.36, 1] as const;

type CreatedAppointment = {
  id: string;
  serviceId: string;
  barberId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no_show";
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function BookingPage() {
  const [currentStep, setCurrentStep] =
    useState<BookingStep>("service");

  const [selectedService, setSelectedService] =
    useState<BookingService | null>(null);

  const [selectedBarber, setSelectedBarber] =
    useState<BookingBarber | null>(null);

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] =
    useState<BookingSlot | null>(null);

  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);

  const [appointment, setAppointment] =
    useState<CreatedAppointment | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  function handleServiceSelect(
    service: BookingService,
  ) {
    setSelectedService(service);

    // A service change invalidates everything after it.
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setCustomerDetails(null);
    setSubmitError(null);
  }

  function handleBarberSelect(
    barber: BookingBarber,
  ) {
    setSelectedBarber(barber);

    // Changing the barber means previously selected
    // availability may no longer be valid.
    setSelectedDate(null);
    setSelectedSlot(null);
    setSubmitError(null);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSubmitError(null);
  }

  function handleTimeSelect(slot: BookingSlot) {
    setSelectedSlot(slot);
    setSubmitError(null);
  }

  async function handleBookingSubmit(
    details: CustomerDetails,
  ) {
    if (
      !selectedService ||
      !selectedDate ||
      !selectedSlot
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setCustomerDetails(details);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          barberId: selectedSlot.barberId,
          appointmentDate: selectedDate,
          startTime: selectedSlot.startTime,
          ...details,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            "We couldn't reserve your chair. Please try again.",
        );
      }

      setAppointment(result.data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't reserve your chair. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStartOver() {
    setCurrentStep("service");
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setCustomerDetails(null);
    setAppointment(null);
    setSubmitError(null);
  }

  /*
   * Once the appointment has been successfully created,
   * the booking flow becomes the confirmation experience.
   */
  if (
    appointment &&
    selectedService &&
    selectedDate &&
    selectedSlot
  ) {
    return (
      <main className="min-h-screen bg-parchment">
        <div className="editorial-container py-16 sm:py-24 lg:py-32">
          <BookingConfirmation
            service={selectedService}
            barber={selectedBarber}
            date={selectedDate}
            slot={selectedSlot}
            customerName={
              customerDetails?.customerName ?? "Guest"
            }
            appointmentId={appointment.id}
            onClose={handleStartOver}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-parchment">
      <div className="editorial-container py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: EASE,
          }}
          className="mb-14 max-w-3xl sm:mb-20"
        >
          <div className="flex items-center gap-4">
            <span className="text-eyebrow text-terracotta">
              The VAREL experience
            </span>

            <span className="h-px w-10 bg-ink/15" />

            <span className="text-[10px] uppercase tracking-[0.14em] text-smoke/60">
              Reserve a chair
            </span>
          </div>

          <h1 className="text-editorial mt-7 text-5xl text-ink sm:text-6xl lg:text-8xl">
            Take your time.
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-7 text-smoke sm:text-base">
            Choose your service, your artisan, and a time
            that works for you. We&apos;ll take care of the
            rest.
          </p>
        </motion.header>

        {/* Progress */}
        <div className="mb-16 max-w-3xl sm:mb-20">
          <BookingProgress currentStep={currentStep} />
        </div>

        {/* Error */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-10 overflow-hidden"
            >
              <div className="border-l-2 border-terracotta bg-terracotta/5 px-5 py-4">
                <p className="text-sm leading-6 text-ink">
                  {submitError}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {currentStep === "service" && (
            <motion.div
              key="service"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.55,
                ease: EASE,
              }}
            >
              <ServiceStep
                selectedServiceId={
                  selectedService?.id ?? null
                }
                onSelect={handleServiceSelect}
              />

              {selectedService && (
                <StepContinue
                  label="Choose your artisan"
                  onClick={() =>
                    setCurrentStep("barber")
                  }
                />
              )}
            </motion.div>
          )}

          {currentStep === "barber" &&
            selectedService && (
              <motion.div
                key="barber"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.55,
                  ease: EASE,
                }}
              >
                <BarberStep
                  selectedBarberId={
                    selectedBarber?.id ?? null
                  }
                  onSelect={handleBarberSelect}
                  onContinue={() =>
                    setCurrentStep("date")
                  }
                />

                <StepBack
                  onClick={() =>
                    setCurrentStep("service")
                  }
                />
              </motion.div>
            )}

          {currentStep === "date" &&
            selectedService && (
              <motion.div
                key="date"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.55,
                  ease: EASE,
                }}
              >
                <DateStep
                  serviceId={selectedService.id}
                  barberId={
                    selectedBarber?.id ?? null
                  }
                  selectedDate={selectedDate}
                  selectedTime={
                    selectedSlot?.startTime ?? null
                  }
                  onSelectDate={handleDateSelect}
                  onSelectTime={handleTimeSelect}
                  onContinue={() =>
                    setCurrentStep("details")
                  }
                />

                <StepBack
                  onClick={() =>
                    setCurrentStep("barber")
                  }
                />
              </motion.div>
            )}

          {currentStep === "details" &&
            selectedService &&
            selectedDate &&
            selectedSlot && (
              <motion.div
                key="details"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.55,
                  ease: EASE,
                }}
              >
                <DetailsStep
                  service={selectedService}
                  barber={selectedBarber}
                  date={selectedDate}
                  slot={selectedSlot}
                  onSubmit={handleBookingSubmit}
                  onBack={() =>
                    setCurrentStep("date")
                  }
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function StepContinue({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-12 flex justify-end border-t border-ink/10 pt-7">
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.4,
          ease: EASE,
        }}
        className="group text-label text-ink"
      >
        <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover:border-terracotta group-hover:text-terracotta">
          {label}
        </span>

        <span className="ml-4 inline-block text-brass transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </motion.button>
    </div>
  );
}

function StepBack({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onClick}
        className="group text-label text-smoke transition-colors hover:text-ink"
      >
        <span className="mr-3 inline-block transition-transform duration-500 group-hover:-translate-x-1">
          ←
        </span>

        Back
      </button>
    </div>
  );
}