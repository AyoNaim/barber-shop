"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

import {
  BookingProgress,
  type BookingStep,
} from "@/components/booking/booking-progress";

const EASE = [0.22, 1, 0.36, 1] as const;

type BookingDrawerProps = {
  open: boolean;
  currentStep: BookingStep;
  onClose: () => void;
  children: React.ReactNode;
};

export function BookingDrawer({
  open,
  currentStep,
  onClose,
  children,
}: BookingDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close booking"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: EASE,
            }}
            className="
              fixed
              inset-0
              z-[60]
              cursor-default
              bg-oak/45
              backdrop-blur-[3px]
            "
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Reserve a chair"
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              duration: 0.8,
              ease: EASE,
            }}
            className="
              fixed
              inset-y-0
              right-0
              z-[70]
              flex
              w-full
              flex-col
              overflow-hidden
              bg-parchment
              text-ink
              shadow-[-30px_0_80px_rgba(20,17,15,0.16)]
              sm:w-[min(100%,_680px)]
              lg:w-[min(100%,_760px)]
            "
          >
            {/* Header */}
            <header
              className="
                relative
                shrink-0
                border-b
                border-ink/10
              "
            >
              <div
                className="
                  flex
                  h-24
                  items-center
                  justify-between
                  px-6
                  sm:px-10
                "
              >
                <div>
                  <p className="text-eyebrow text-smoke">
                    Private appointment
                  </p>

                  <h2 className="mt-2 font-display text-2xl tracking-[-0.025em] text-ink">
                    Reserve a chair
                  </h2>
                </div>

                <motion.button
                  type="button"
                  onClick={onClose}
                  aria-label="Close booking"
                  whileHover={{
                    rotate: 90,
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: EASE,
                  }}
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-ink/15
                    text-ink
                  "
                >
                  <X
                    size={17}
                    strokeWidth={1.25}
                  />
                </motion.button>
              </div>

              {/* Progress */}
              <div
                className="
                  px-6
                  pb-7
                  pt-1
                  sm:px-10
                "
              >
                <BookingProgress
                  currentStep={currentStep}
                />
              </div>
            </header>

            {/* Content */}
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.65,
                  ease: EASE,
                }}
                className="
                  min-h-full
                  px-6
                  py-10
                  sm:px-10
                  sm:py-14
                "
              >
                {children}
              </motion.div>
            </div>

            {/* Footer */}
            <footer
              className="
                shrink-0
                border-t
                border-ink/10
                bg-bone/35
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-6
                  py-4
                  sm:px-10
                "
              >
                <p className="text-label text-smoke">
                  VAREL · Lagos
                </p>

                <p className="text-label text-smoke">
                  Mon — Sat · 09:00 — 20:00
                </p>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}