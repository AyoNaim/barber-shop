"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export type BookingStep =
  | "service"
  | "barber"
  | "date"
  | "details";

export type BookingStepItem = {
  id: BookingStep;
  number: string;
  label: string;
};

export const BOOKING_STEPS: BookingStepItem[] = [
  {
    id: "service",
    number: "01",
    label: "Service",
  },
  {
    id: "barber",
    number: "02",
    label: "Barber",
  },
  {
    id: "date",
    number: "03",
    label: "Time",
  },
  {
    id: "details",
    number: "04",
    label: "Details",
  },
];

type BookingProgressProps = {
  currentStep: BookingStep;
};

export function BookingProgress({
  currentStep,
}: BookingProgressProps) {
  const currentIndex = BOOKING_STEPS.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <nav
      aria-label="Booking progress"
      className="w-full"
    >
      <ol className="relative flex items-start justify-between">
        {/* Progress rail */}
        <div
          aria-hidden="true"
          className="
            absolute
            left-0
            right-0
            top-[5px]
            h-px
            bg-ink/10
          "
        >
          <motion.div
            className="
              h-px
              origin-left
              bg-brass
            "
            initial={false}
            animate={{
              scaleX:
                currentIndex /
                (BOOKING_STEPS.length - 1),
            }}
            transition={{
              duration: 0.8,
              ease: EASE,
            }}
          />
        </div>

        {BOOKING_STEPS.map(
          (step, index) => {
            const isActive =
              step.id === currentStep;

            const isComplete =
              index < currentIndex;

            return (
              <li
                key={step.id}
                className="relative flex flex-col items-start"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.72,
                    opacity:
                      isActive || isComplete
                        ? 1
                        : 0.5,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                  }}
                  className="
                    relative
                    z-10
                    flex
                    h-3
                    w-3
                    items-center
                    justify-center
                    rounded-full
                    bg-parchment
                  "
                >
                  <motion.span
                    initial={false}
                    animate={{
                      scale:
                        isActive || isComplete
                          ? 1
                          : 0.7,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: EASE,
                    }}
                    className="
                      block
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-ink
                    "
                  />

                  {isActive && (
                    <motion.span
                      layoutId="booking-progress-ring"
                      className="
                        absolute
                        inset-[-3px]
                        rounded-full
                        border
                        border-brass
                      "
                      transition={{
                        duration: 0.6,
                        ease: EASE,
                      }}
                    />
                  )}
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    y: isActive ? 0 : 2,
                    opacity:
                      isActive || isComplete
                        ? 1
                        : 0.45,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                  }}
                  className="mt-4"
                >
                  <p
                    className={`
                      text-label
                      transition-colors
                      duration-500
                      ${
                        isActive
                          ? "text-ink"
                          : isComplete
                            ? "text-ink/70"
                            : "text-smoke"
                      }
                    `}
                  >
                    <span className="mr-2 text-brass">
                      {step.number}
                    </span>
                    {step.label}
                  </p>
                </motion.div>
              </li>
            );
          },
        )}
      </ol>
    </nav>
  );
}