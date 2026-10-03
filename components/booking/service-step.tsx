"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type BookingService = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  price: number;
};

type ServiceStepProps = {
  selectedServiceId: string | null;
  onSelect: (service: BookingService) => void;
};

export function ServiceStep({
  selectedServiceId,
  onSelect,
}: ServiceStepProps) {
  const [services, setServices] = useState<
    BookingService[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "/api/services",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ??
              "Unable to load services.",
          );
        }

        if (cancelled) {
          return;
        }

        setServices(result.data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load services.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="booking-service-title">
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: EASE,
        }}
      >
        <p className="text-eyebrow text-terracotta">
          Begin your ritual
        </p>

        <h3
          id="booking-service-title"
          className="
            mt-4
            max-w-[12ch]
            font-display
            text-[clamp(2.6rem,7vw,4.75rem)]
            leading-[0.9]
            tracking-[-0.045em]
            text-ink
          "
        >
          What are we creating today?
        </h3>

        <p
          className="
            mt-6
            max-w-md
            text-sm
            leading-7
            text-smoke
            sm:text-[0.95rem]
          "
        >
          Choose the ritual that brings you
          through our doors. We will take care
          of the rest.
        </p>
      </motion.div>

      <div className="mt-12">
        {isLoading && (
          <ServiceListSkeleton />
        )}

        {error && !isLoading && (
          <ServiceError
            message={error}
            onRetry={() => {
              window.location.reload();
            }}
          />
        )}

        {!isLoading &&
          !error &&
          services.length === 0 && (
            <EmptyServices />
          )}

        {!isLoading &&
          !error &&
          services.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="border-t border-ink/10"
            >
              {services.map(
                (service, index) => (
                  <ServiceOption
                    key={service.id}
                    service={service}
                    index={index}
                    selected={
                      service.id ===
                      selectedServiceId
                    }
                    onSelect={() =>
                      onSelect(service)
                    }
                  />
                ),
              )}
            </motion.div>
          )}
      </div>
    </section>
  );
}

function ServiceOption({
  service,
  index,
  selected,
  onSelect,
}: {
  service: BookingService;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      variants={{
        hidden: {
          opacity: 0,
          y: 16,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.65,
            ease: EASE,
          },
        },
      }}
      whileHover={{
        x: 4,
      }}
      whileTap={{
        scale: 0.995,
      }}
      transition={{
        duration: 0.45,
        ease: EASE,
      }}
      className={`
        group
        relative
        flex
        w-full
        items-start
        gap-4
        border-b
        border-ink/10
        py-7
        text-left
        transition-colors
        duration-500
        sm:gap-6
        sm:py-8
        ${
          selected
            ? "bg-bone/45"
            : "hover:bg-bone/20"
        }
      `}
    >
      {/* Selection marker */}
      <div
        className="
          relative
          mt-1
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-ink/20
        "
      >
        <motion.div
          initial={false}
          animate={{
            scale: selected ? 1 : 0,
            opacity: selected ? 1 : 0,
          }}
          transition={{
            duration: 0.45,
            ease: EASE,
          }}
          className="
            absolute
            inset-1
            rounded-full
            bg-terracotta
          "
        />

        <AnimatePresence>
          {selected && (
            <motion.span
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                duration: 0.3,
                ease: EASE,
              }}
              className="relative z-10 text-parchment"
            >
              <Check
                size={12}
                strokeWidth={2}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Service content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span
                className={`
                  font-display
                  text-xl
                  tracking-[-0.025em]
                  transition-colors
                  duration-500
                  sm:text-2xl
                  ${
                    selected
                      ? "text-terracotta"
                      : "text-ink"
                  }
                `}
              >
                {service.name}
              </span>

              <span className="hidden text-label text-smoke sm:inline">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {service.description && (
              <p
                className="
                  mt-3
                  max-w-[38ch]
                  text-xs
                  leading-6
                  text-smoke
                  sm:text-sm
                "
              >
                {service.description}
              </p>
            )}
          </div>

          <motion.span
            initial={false}
            animate={{
              x: selected ? 0 : -4,
              opacity: selected ? 1 : 0.55,
            }}
            transition={{
              duration: 0.45,
              ease: EASE,
            }}
            className="
              hidden
              shrink-0
              sm:block
            "
          >
            <ArrowUpRight
              size={18}
              strokeWidth={1.25}
            />
          </motion.span>
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            gap-4
          "
        >
          <span className="text-label text-smoke">
            {service.durationMinutes} min
          </span>

          <span
            aria-hidden="true"
            className="h-px w-5 bg-ink/15"
          />

          <span className="text-price text-ink">
            {formatPrice(service.price)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function ServiceListSkeleton() {
  return (
    <div
      aria-label="Loading services"
      className="border-t border-ink/10"
    >
      {Array.from({ length: 4 }).map(
        (_, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0.35,
            }}
            animate={{
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.08,
            }}
            className="
              flex
              gap-5
              border-b
              border-ink/10
              py-8
            "
          >
            <div className="h-7 w-7 shrink-0 rounded-full bg-ink/10" />

            <div className="flex-1">
              <div className="h-6 w-40 rounded-sm bg-ink/10" />
              <div className="mt-4 h-3 w-3/4 rounded-sm bg-ink/10" />
              <div className="mt-5 h-3 w-24 rounded-sm bg-ink/10" />
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}

function ServiceError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="
        border
        border-terracotta/20
        bg-terracotta/5
        p-6
      "
    >
      <p className="text-eyebrow text-terracotta">
        Something went wrong
      </p>

      <p className="mt-3 text-sm leading-6 text-smoke">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-5
          text-label
          text-ink
          underline
          decoration-ink/30
          underline-offset-4
          transition-colors
          hover:text-terracotta
        "
      >
        Try again
      </button>
    </div>
  );
}

function EmptyServices() {
  return (
    <div className="border-t border-ink/10 py-10">
      <p className="text-sm leading-6 text-smoke">
        There are no services available for
        booking at the moment.
      </p>
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}