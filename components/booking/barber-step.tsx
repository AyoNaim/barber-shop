"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Loader2,
  MoveRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type BookingBarber = {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
};

type BarberStepProps = {
  selectedBarberId: string | null;
  onSelect: (barber: BookingBarber) => void;
  onContinue?: () => void;
};

export function BarberStep({
  selectedBarberId,
  onSelect,
  onContinue,
}: BarberStepProps) {
  const [barbers, setBarbers] = useState<
    BookingBarber[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBarbers() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "/api/barbers",
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
              "Unable to load our artisans.",
          );
        }

        if (cancelled) {
          return;
        }

        setBarbers(result.data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load our artisans.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadBarbers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="booking-barber-title">
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
          The hands behind the craft
        </p>

        <h3
          id="booking-barber-title"
          className="
            mt-4
            max-w-[11ch]
            font-display
            text-[clamp(2.6rem,7vw,4.75rem)]
            leading-[0.9]
            tracking-[-0.045em]
            text-ink
          "
        >
          Choose your artisan.
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
          Every chair has its own rhythm.
          Find the person whose approach
          feels right for you.
        </p>
      </motion.div>

      <div className="mt-12">
        {isLoading && <BarberSkeleton />}

        {error && !isLoading && (
          <BarberError
            message={error}
            onRetry={() => {
              window.location.reload();
            }}
          />
        )}

        {!isLoading &&
          !error &&
          barbers.length === 0 && (
            <EmptyBarbers />
          )}

        {!isLoading &&
          !error &&
          barbers.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-10
                sm:gap-x-5
              "
            >
              {barbers.map(
                (barber, index) => (
                  <BarberCard
                    key={barber.id}
                    barber={barber}
                    index={index}
                    selected={
                      barber.id ===
                      selectedBarberId
                    }
                    onSelect={() =>
                      onSelect(barber)
                    }
                  />
                ),
              )}
            </motion.div>
          )}
      </div>

      <AnimatePresence>
        {selectedBarberId && onContinue && (
          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 14,
            }}
            transition={{
              duration: 0.5,
              ease: EASE,
            }}
            className="
              mt-10
              flex
              justify-end
            "
          >
            <motion.button
              type="button"
              onClick={onContinue}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                duration: 0.4,
                ease: EASE,
              }}
              className="
                group
                flex
                items-center
                gap-4
                bg-ink
                px-6
                py-4
                text-parchment
              "
            >
              <span className="text-label">
                Continue
              </span>

              <MoveRight
                size={17}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-500
                  ease-[var(--ease-editorial)]
                  group-hover:translate-x-1
                "
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function BarberCard({
  barber,
  index,
  selected,
  onSelect,
}: {
  barber: BookingBarber;
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
          y: 22,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.75,
            ease: EASE,
          },
        },
      }}
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.99,
      }}
      transition={{
        duration: 0.5,
        ease: EASE,
      }}
      className="
        group
        relative
        min-w-0
        text-left
      "
    >
      {/* Portrait */}
      <div
        className={`
          image-editorial
          grain
          relative
          aspect-[0.78]
          overflow-hidden
          bg-bone
          ${
            selected
              ? "ring-1 ring-terracotta"
              : ""
          }
        `}
      >
        {barber.imageUrl ? (
          <motion.img
            src={barber.imageUrl}
            alt={barber.name}
            loading="lazy"
            initial={{
              scale: 1.04,
            }}
            animate={{
              scale: selected ? 1.015 : 1.04,
            }}
            whileHover={{
              scale: 1.015,
            }}
            transition={{
              duration: 1,
              ease: EASE,
            }}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              grayscale-[12%]
            "
          />
        ) : (
          <BarberPlaceholder
            name={barber.name}
          />
        )}

        {/* Image wash */}
        <motion.div
          initial={false}
          animate={{
            opacity: selected ? 0.15 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: EASE,
          }}
          className="
            absolute
            inset-0
            bg-terracotta
            mix-blend-multiply
          "
        />

        {/* Number */}
        <div
          className="
            absolute
            left-4
            top-4
            z-10
            flex
            h-8
            min-w-8
            items-center
            justify-center
            border
            border-parchment/50
            bg-oak/15
            px-2
            backdrop-blur-sm
          "
        >
          <span className="text-label text-parchment">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Selection mark */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.7,
              }}
              transition={{
                duration: 0.45,
                ease: EASE,
              }}
              className="
                absolute
                right-4
                top-4
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-terracotta
                text-parchment
              "
            >
              <Check
                size={15}
                strokeWidth={1.75}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover arrow */}
        <motion.div
          initial={false}
          animate={{
            opacity: selected ? 1 : 0,
            y: selected ? 0 : 8,
          }}
          whileHover={{
            opacity: 1,
          }}
          transition={{
            duration: 0.45,
            ease: EASE,
          }}
          className="
            absolute
            bottom-4
            right-4
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-parchment
            text-ink
          "
        >
          <ArrowUpRight
            size={16}
            strokeWidth={1.25}
          />
        </motion.div>
      </div>

      {/* Information */}
      <div className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4
              className={`
                font-display
                text-xl
                leading-none
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
              {barber.name}
            </h4>

            {barber.role && (
              <p className="mt-2 text-label text-smoke">
                {barber.role}
              </p>
            )}
          </div>

          <span
            className="
              pt-1
              text-label
              text-smoke/60
            "
          >
            0{index + 1}
          </span>
        </div>

        {barber.bio && (
          <motion.p
            initial={false}
            animate={{
              height: selected
                ? "auto"
                : 0,
              opacity: selected ? 1 : 0,
              marginTop: selected ? 12 : 0,
            }}
            transition={{
              duration: 0.5,
              ease: EASE,
            }}
            className="
              overflow-hidden
              text-xs
              leading-6
              text-smoke
            "
          >
            {barber.bio}
          </motion.p>
        )}
      </div>

      {/* Selected underline */}
      <motion.div
        initial={false}
        animate={{
          scaleX: selected ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: EASE,
        }}
        className="
          mt-5
          h-px
          origin-left
          bg-terracotta
        "
      />
    </motion.button>
  );
}

function BarberPlaceholder({
  name,
}: {
  name: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        bg-bone
      "
    >
      <span
        className="
          font-display
          text-5xl
          tracking-[-0.04em]
          text-ink/20
        "
      >
        {initials}
      </span>
    </div>
  );
}

function BarberSkeleton() {
  return (
    <div
      aria-label="Loading artisans"
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-5
      "
    >
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0.35,
            }}
            animate={{
              opacity: [
                0.35,
                0.65,
                0.35,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          >
            <div className="aspect-[0.78] bg-bone" />

            <div className="pt-5">
              <div className="h-5 w-28 bg-bone" />
              <div className="mt-3 h-3 w-16 bg-bone" />
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}

function BarberError({
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

function EmptyBarbers() {
  return (
    <div className="border-t border-ink/10 py-10">
      <p className="text-sm leading-6 text-smoke">
        Our artisans are currently
        unavailable for booking.
      </p>
    </div>
  );
}