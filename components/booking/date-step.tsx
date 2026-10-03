"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const DAYS_TO_SHOW = 21;

export type BookingSlot = {
  startTime: string;
  endTime: string;
  barberId: string;
};

export type AvailabilityResponse = {
  success: boolean;
  data?: {
    date: string;
    serviceId: string;
    barberId: string | null;
    slots: BookingSlot[];
  };
  error?: string;
};

export type DateStepProps = {
  serviceId: string;
  barberId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (slot: BookingSlot) => void;
  onContinue?: () => void;
};

export type DateOption = {
  value: string;
  weekday: string;
  day: string;
  month: string;
  isToday: boolean;
};

export function DateStep({
  serviceId,
  barberId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onContinue,
}: DateStepProps) {
  const dates = useMemo(
    () => createDateOptions(DAYS_TO_SHOW),
    [],
  );

  const [visibleStart, setVisibleStart] =
    useState(0);

  const [slots, setSlots] = useState<
    BookingSlot[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const visibleDates = dates.slice(
    visibleStart,
    visibleStart + 7,
  );

  const selectedDateOption = dates.find(
    (date) => date.value === selectedDate,
  );

  useEffect(() => {
    if (!selectedDate || !serviceId) {
      setSlots([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    /*
     * TypeScript now knows this is a string.
     *
     * The previous code passed `selectedDate`
     * directly into URLSearchParams, but its
     * declared type is `string | null`.
     */
    const date = selectedDate;

    let cancelled = false;

    async function loadAvailability() {
      try {
        setIsLoading(true);
        setError(null);
        setSlots([]);

        const params = new URLSearchParams({
          serviceId,
          date,
        });

        if (barberId) {
          params.set(
            "barberId",
            barberId,
          );
        }

        const response = await fetch(
          `/api/booking/availability?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        let result: AvailabilityResponse;

        try {
          result =
            (await response.json()) as AvailabilityResponse;
        } catch {
          throw new Error(
            "The availability service returned an invalid response.",
          );
        }

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.error ??
              "Unable to load available times.",
          );
        }

        if (cancelled) {
          return;
        }

        setSlots(result.data.slots);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load available times.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    serviceId,
    barberId,
    selectedDate,
  ]);

  function moveDates(
    direction: -1 | 1,
  ) {
    setVisibleStart((current) => {
      const next =
        current + direction * 7;

      return Math.max(
        0,
        Math.min(
          next,
          Math.max(
            dates.length - 7,
            0,
          ),
        ),
      );
    });
  }

  function retryAvailability() {
    if (!selectedDate) {
      return;
    }

    /*
     * Re-selecting the same date does not change
     * the dependency array, so we force the
     * request by clearing the current error and
     * fetching directly.
     */
    setError(null);
    setSlots([]);
    setIsLoading(true);

    const date = selectedDate;

    void (async () => {
      try {
        const params = new URLSearchParams({
          serviceId,
          date,
        });

        if (barberId) {
          params.set(
            "barberId",
            barberId,
          );
        }

        const response = await fetch(
          `/api/booking/availability?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        let result: AvailabilityResponse;

        try {
          result =
            (await response.json()) as AvailabilityResponse;
        } catch {
          throw new Error(
            "The availability service returned an invalid response.",
          );
        }

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.error ??
              "Unable to load available times.",
          );
        }

        setSlots(result.data.slots);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load available times.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <section aria-labelledby="booking-date-title">
      {/* ─────────────────────────────────────
          INTRO
      ───────────────────────────────────── */}

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
          Find your moment
        </p>

        <h3
          id="booking-date-title"
          className="
            mt-4
            max-w-[10ch]
            font-display
            text-[clamp(2.6rem,7vw,4.75rem)]
            leading-[0.9]
            tracking-[-0.045em]
            text-ink
          "
        >
          When will you come in?
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
          Choose a day, then find a time
          that gives the ritual room to breathe.
        </p>
      </motion.div>

      {/* ─────────────────────────────────────
          DATE RAIL
      ───────────────────────────────────── */}

      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-label text-smoke">
            {formatMonthLabel(
              visibleDates[0]?.value ??
                dates[0]?.value,
            )}
          </p>

          <div className="flex items-center gap-2">
            <DateNavigationButton
              label="Previous dates"
              disabled={visibleStart === 0}
              onClick={() =>
                moveDates(-1)
              }
              icon={
                <ArrowLeft size={15} />
              }
            />

            <DateNavigationButton
              label="Next dates"
              disabled={
                visibleStart + 7 >=
                dates.length
              }
              onClick={() =>
                moveDates(1)
              }
              icon={
                <ArrowRight size={15} />
              }
            />
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-7
            border-y
            border-ink/10
          "
        >
          {visibleDates.map(
            (date, index) => (
              <DateOptionButton
                key={date.value}
                date={date}
                selected={
                  date.value ===
                  selectedDate
                }
                onClick={() => {
                  onSelectDate(
                    date.value,
                  );
                }}
                index={index}
              />
            ),
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────
          AVAILABILITY
      ───────────────────────────────────── */}

      <div className="mt-12">
        <AnimatePresence mode="wait">
          {!selectedDate && (
            <motion.div
              key="no-date"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.45,
                ease: EASE,
              }}
              className="
                flex
                min-h-32
                items-center
                border-t
                border-ink/10
              "
            >
              <div>
                <p className="text-eyebrow text-smoke">
                  Your time
                </p>

                <p className="mt-3 font-display text-2xl tracking-[-0.025em] text-ink">
                  Select a day to see what's open.
                </p>
              </div>
            </motion.div>
          )}

          {selectedDate && isLoading && (
            <AvailabilityLoading
              key="loading"
            />
          )}

          {selectedDate &&
            !isLoading &&
            error && (
              <AvailabilityError
                key="error"
                message={error}
                onRetry={retryAvailability}
              />
            )}

          {selectedDate &&
            !isLoading &&
            !error &&
            slots.length === 0 && (
              <NoAvailability
                key="empty"
              />
            )}

          {selectedDate &&
            !isLoading &&
            !error &&
            slots.length > 0 && (
              <AvailabilityGrid
                key={selectedDate}
                slots={slots}
                selectedTime={
                  selectedTime
                }
                onSelectTime={
                  onSelectTime
                }
              />
            )}
        </AnimatePresence>
      </div>

      {/* ─────────────────────────────────────
          SELECTED APPOINTMENT
      ───────────────────────────────────── */}

      <AnimatePresence>
        {selectedDate &&
          selectedTime && (
            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 12,
              }}
              transition={{
                duration: 0.55,
                ease: EASE,
              }}
              className="
                mt-10
                border-t
                border-ink/10
                pt-6
              "
            >
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-eyebrow text-terracotta">
                    Your appointment
                  </p>

                  <div className="mt-3 flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-2xl tracking-[-0.025em] text-ink">
                      {formatLongDate(
                        selectedDate,
                      )}
                    </span>

                    <span className="text-smoke">
                      ·
                    </span>

                    <span className="text-price text-ink">
                      {selectedTime}
                    </span>
                  </div>
                </div>

                {onContinue && (
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
                      shrink-0
                      items-center
                      gap-3
                      bg-ink
                      px-5
                      py-4
                      text-parchment
                    "
                  >
                    <span className="text-label">
                      Continue
                    </span>

                    <ArrowRight
                      size={16}
                      strokeWidth={1.25}
                      className="
                        transition-transform
                        duration-500
                        ease-[var(--ease-editorial)]
                        group-hover:translate-x-1
                      "
                    />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </section>
  );
}


/* ─────────────────────────────────────────────
   DATE OPTION
───────────────────────────────────────────── */

function DateOptionButton({
  date,
  selected,
  onClick,
  index,
}: {
  date: DateOption;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: EASE,
      }}
      whileHover={{
        backgroundColor: selected
          ? undefined
          : "rgba(216, 203, 185, 0.22)",
      }}
      className="
        group
        relative
        flex
        min-w-0
        flex-col
        items-center
        justify-center
        gap-2
        border-r
        border-ink/10
        px-1
        py-5
        last:border-r-0
        sm:py-6
      "
    >
      <span
        className={`
          text-label
          transition-colors
          duration-500
          ${
            selected
              ? "text-terracotta"
              : "text-smoke"
          }
        `}
      >
        {date.weekday}
      </span>

      <span
        className={`
          font-display
          text-2xl
          leading-none
          tracking-[-0.03em]
          transition-colors
          duration-500
          sm:text-3xl
          ${
            selected
              ? "text-ink"
              : "text-ink/75"
          }
        `}
      >
        {date.day}
      </span>

      <span className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-smoke/70">
        {date.month}
      </span>

      {date.isToday && (
        <span className="mt-1 h-1 w-1 rounded-full bg-sage" />
      )}

      <motion.span
        initial={false}
        animate={{
          scaleX: selected ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: EASE,
        }}
        className="
          absolute
          inset-x-2
          bottom-0
          h-[2px]
          origin-center
          bg-terracotta
        "
      />
    </motion.button>
  );
}


/* ─────────────────────────────────────────────
   AVAILABILITY GRID
───────────────────────────────────────────── */

function AvailabilityGrid({
  slots,
  selectedTime,
  onSelectTime,
}: {
  slots: BookingSlot[];
  selectedTime: string | null;
  onSelectTime: (slot: BookingSlot) => void;
}) {
  const groups = groupSlots(slots);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        ease: EASE,
      }}
    >
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-eyebrow text-smoke">
            Available times
          </p>

          <p className="mt-2 text-xs text-smoke">
            All times shown in Lagos time.
          </p>
        </div>

        <Clock3
          size={18}
          strokeWidth={1.25}
          className="text-brass"
        />
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-label text-smoke">
                {group.label}
              </span>

              <span className="h-px flex-1 bg-ink/10" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {group.slots.map(
                (slot, index) => {
                  const selected =
                    slot.startTime ===
                    selectedTime;

                  return (
                    <motion.button
                      key={`${slot.barberId}-${slot.startTime}`}
                      type="button"
                      onClick={() =>
                        onSelectTime(slot)
                      }
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.45,
                        delay:
                          index * 0.025,
                        ease: EASE,
                      }}
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      className={`
                        relative
                        flex
                        min-h-14
                        items-center
                        justify-center
                        border
                        px-3
                        transition-colors
                        duration-400
                        ${
                          selected
                            ? "border-terracotta bg-terracotta text-parchment"
                            : "border-ink/12 bg-transparent text-ink hover:border-ink/30 hover:bg-bone/40"
                        }
                      `}
                    >
                      <span className="text-price">
                        {slot.startTime}
                      </span>

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
                            className="
                              absolute
                              right-2
                              top-2
                            "
                          >
                            <Check
                              size={11}
                              strokeWidth={2}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                },
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   LOADING
───────────────────────────────────────────── */

function AvailabilityLoading() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="border-t border-ink/10 py-10"
    >
      <div className="flex items-center gap-4">
        <Loader2
          size={18}
          strokeWidth={1.25}
          className="animate-spin text-brass"
        />

        <div>
          <p className="text-eyebrow text-smoke">
            Checking the chairs
          </p>

          <p className="mt-2 font-display text-xl tracking-[-0.02em] text-ink">
            Finding a time for you.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   ERROR
───────────────────────────────────────────── */

function AvailabilityError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        border-t
        border-ink/10
        py-8
      "
      role="alert"
    >
      <p className="text-eyebrow text-terracotta">
        We couldn't check the chairs
      </p>

      <p className="mt-3 max-w-md text-sm leading-6 text-smoke">
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
          decoration-ink/25
          underline-offset-4
          transition-colors
          hover:text-terracotta
        "
      >
        Try again
      </button>
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   EMPTY
───────────────────────────────────────────── */

function NoAvailability() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        border-t
        border-ink/10
        py-10
      "
    >
      <p className="text-eyebrow text-smoke">
        A quieter day
      </p>

      <p className="mt-3 max-w-md font-display text-2xl leading-tight tracking-[-0.025em] text-ink">
        There are no open chairs on this
        day.
      </p>

      <p className="mt-3 max-w-md text-sm leading-6 text-smoke">
        Try another date and we'll find a
        time that works.
      </p>
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   DATE NAVIGATION
───────────────────────────────────────────── */

function DateNavigationButton({
  label,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      whileHover={
        disabled
          ? undefined
          : {
              y: -1,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.92,
            }
      }
      transition={{
        duration: 0.35,
        ease: EASE,
      }}
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        border
        border-ink/12
        text-ink
        transition-opacity
        duration-300
        disabled:pointer-events-none
        disabled:opacity-25
      "
    >
      {icon}
    </motion.button>
  );
}


/* ─────────────────────────────────────────────
   GROUP SLOTS
───────────────────────────────────────────── */

function groupSlots(
  slots: BookingSlot[],
) {
  const groups = {
    Morning: [] as BookingSlot[],
    Afternoon: [] as BookingSlot[],
    Evening: [] as BookingSlot[],
  };

  for (const slot of slots) {
    const hour = Number(
      slot.startTime.slice(0, 2),
    );

    if (hour < 12) {
      groups.Morning.push(slot);
    } else if (hour < 17) {
      groups.Afternoon.push(slot);
    } else {
      groups.Evening.push(slot);
    }
  }

  return Object.entries(groups)
    .filter(
      ([, groupSlots]) =>
        groupSlots.length > 0,
    )
    .map(
      ([label, groupSlots]) => ({
        label,
        slots: groupSlots,
      }),
    );
}


/* ─────────────────────────────────────────────
   DATE CREATION
───────────────────────────────────────────── */

function createDateOptions(
  count: number,
): DateOption[] {
  const today = getLagosToday();
  const dates: DateOption[] = [];

  for (
    let offset = 0;
    offset < count;
    offset += 1
  ) {
    const date = addDays(
      today,
      offset,
    );

    const dateObject = new Date(
      `${date}T12:00:00Z`,
    );

    dates.push({
      value: date,

      weekday: new Intl.DateTimeFormat(
        "en-US",
        {
          weekday: "short",
          timeZone: "UTC",
        },
      )
        .format(dateObject)
        .slice(0, 3)
        .toUpperCase(),

      day: new Intl.DateTimeFormat(
        "en-US",
        {
          day: "2-digit",
          timeZone: "UTC",
        },
      ).format(dateObject),

      month:
        new Intl.DateTimeFormat(
          "en-US",
          {
            month: "short",
            timeZone: "UTC",
          },
        )
          .format(dateObject)
          .slice(0, 3)
          .toUpperCase(),

      isToday: offset === 0,
    });
  }

  return dates;
}


/* ─────────────────────────────────────────────
   LAGOS DATE
───────────────────────────────────────────── */

function getLagosToday(): string {
  const parts = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  ).formatToParts(new Date());

  const year = parts.find(
    (part) => part.type === "year",
  )?.value;

  const month = parts.find(
    (part) => part.type === "month",
  )?.value;

  const day = parts.find(
    (part) => part.type === "day",
  )?.value;

  return `${year}-${month}-${day}`;
}


/* ─────────────────────────────────────────────
   ADD DAYS
───────────────────────────────────────────── */

function addDays(
  dateString: string,
  amount: number,
): string {
  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day + amount,
    ),
  );

  return [
    date.getUTCFullYear(),
    String(
      date.getUTCMonth() + 1,
    ).padStart(2, "0"),
    String(
      date.getUTCDate(),
    ).padStart(2, "0"),
  ].join("-");
}


/* ─────────────────────────────────────────────
   MONTH LABEL
───────────────────────────────────────────── */

function formatMonthLabel(
  dateString?: string,
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(
    `${dateString}T12:00:00Z`,
  );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
}


/* ─────────────────────────────────────────────
   LONG DATE
───────────────────────────────────────────── */

function formatLongDate(
  dateString: string,
): string {
  const date = new Date(
    `${dateString}T12:00:00Z`,
  );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
}