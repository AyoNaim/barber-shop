"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  {
    number: "01",
    label: "The House",
    description: "A place for considered grooming.",
    href: "#house",
  },
  {
    number: "02",
    label: "Artisans",
    description: "Meet the hands behind the craft.",
    href: "#artisans",
  },
  {
    number: "03",
    label: "Services",
    description: "Rituals, cuts and everything between.",
    href: "#services",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ─────────────────────────────────────
          DESKTOP / MOBILE HEADER
      ───────────────────────────────────── */}

      <div className="editorial-container">
        <nav
          aria-label="Main navigation"
          className="
            relative
            flex
            h-24
            items-center
            justify-between
          "
        >
          {/* ─────────────────────────────────
              BRAND
          ───────────────────────────────── */}

          <Link
            href="/"
            aria-label="VAREL home"
            onClick={closeMenu}
            className="
              group
              relative
              z-[70]
              flex
              items-center
            "
          >
            <span
              className="
                font-display
                text-[1.65rem]
                font-medium
                tracking-[-0.04em]
                text-ink
              "
            >
              VAREL
            </span>

            <motion.span
              animate={{
                scale: isMenuOpen ? 1.5 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: EASE,
              }}
              className="
                ml-2
                h-1
                w-1
                rounded-full
                bg-terracotta
              "
            />
          </Link>

          {/* ─────────────────────────────────
              DESKTOP NAVIGATION
          ───────────────────────────────── */}

          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-8
              lg:flex
            "
          >
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* ─────────────────────────────────
              RIGHT SIDE
          ───────────────────────────────── */}

          <div className="relative z-[70] flex items-center gap-4">
            {/* Status */}

            <div
              className="
                hidden
                items-center
                gap-2
                xl:flex
              "
            >
              <span
                className="
                  relative
                  flex
                  h-2
                  w-2
                "
              >
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-sage
                    opacity-60
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2
                    w-2
                    rounded-full
                    bg-sage
                  "
                />
              </span>

              <span className="text-label text-ink">
                Open today
              </span>
            </div>

            {/* Desktop Booking CTA */}

            <motion.a
              href="/booking"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.4,
                ease: EASE,
              }}
              className="
                magnetic
                hidden
                items-center
                gap-3
                rounded-full
                bg-ink
                px-5
                py-3
                text-[0.68rem]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-parchment
                lg:flex
              "
            >
              <span>Reserve a Chair</span>

              <span
                aria-hidden="true"
                className="
                  text-[0.9rem]
                  leading-none
                  transition-transform
                  duration-500
                  ease-[var(--ease-editorial)]
                  group-hover:translate-x-1
                "
              >
                ↗
              </span>
            </motion.a>

            {/* ───────────────────────────────
                MOBILE MENU BUTTON
            ─────────────────────────────── */}

            <motion.button
              type="button"
              aria-label={
                isMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() =>
                setIsMenuOpen((current) => !current)
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.94,
                    }
              }
              className="
                group
                relative
                flex
                h-12
                w-12
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-ink/15
                bg-parchment/80
                backdrop-blur-md
                lg:hidden
              "
            >
              {/* Decorative orbit */}

              <motion.span
                animate={{
                  rotate: isMenuOpen ? 180 : 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: EASE,
                }}
                aria-hidden="true"
                className="
                  absolute
                  inset-[5px]
                  rounded-full
                  border
                  border-ink/10
                "
              />

              {/* Small brass marker */}

              <motion.span
                animate={{
                  rotate: isMenuOpen ? -90 : 0,
                  scale: isMenuOpen ? 1 : 0.7,
                  opacity: isMenuOpen ? 1 : 0.7,
                }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                }}
                aria-hidden="true"
                className="
                  absolute
                  right-[7px]
                  top-[7px]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-terracotta
                "
              />

              {/* Custom VAREL menu mark */}

              <span
                aria-hidden="true"
                className="
                  relative
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                "
              >
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 0 : -3,
                    width: isMenuOpen ? 15 : 13,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: EASE,
                  }}
                  className="
                    absolute
                    h-px
                    bg-ink
                  "
                />

                <motion.span
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? 0 : 3,
                    width: isMenuOpen ? 15 : 13,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: EASE,
                  }}
                  className="
                    absolute
                    h-px
                    bg-ink
                  "
                />

                {/* Central vertical detail */}

                <motion.span
                  animate={{
                    scaleY: isMenuOpen ? 0 : 1,
                    opacity: isMenuOpen ? 0 : 0.45,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: EASE,
                  }}
                  className="
                    absolute
                    h-2
                    w-px
                    bg-terracotta
                  "
                />
              </span>
            </motion.button>
          </div>
        </nav>
      </div>

      {/* ─────────────────────────────────────
          MOBILE NAVIGATION
      ───────────────────────────────────── */}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="VAREL navigation"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.45,
              ease: EASE,
            }}
            className="
              fixed
              inset-0
              z-[60]
              bg-parchment
              lg:hidden
            "
          >
            {/* ───────────────────────────────
                EDITORIAL BACKGROUND
            ─────────────────────────────── */}

            <MenuArtwork />

            {/* Warm atmospheric wash */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_90%_15%,rgba(194,89,63,0.09),transparent_30%),radial-gradient(circle_at_10%_85%,rgba(139,146,117,0.08),transparent_32%)]
              "
            />

            {/* ───────────────────────────────
                MENU CONTENT
            ─────────────────────────────── */}

            <div className="relative flex h-full flex-col px-6 pb-7 pt-28 sm:px-10">
              {/* Header */}

              <div className="flex items-center justify-between border-b border-ink/10 pb-5">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : 0.1,
                    ease: EASE,
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-eyebrow text-smoke">
                    The House
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-terracotta"
                  />
                </motion.div>

                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : 0.15,
                  }}
                  className="text-label text-smoke"
                >
                  Lagos · NG
                </motion.span>
              </div>

              {/* Main links */}

              <div className="flex flex-1 items-center">
                <nav
                  aria-label="Mobile navigation"
                  className="w-full"
                >
                  <ul className="divide-y divide-ink/10">
                    {navigation.map((item, index) => (
                      <MobileNavItem
                        key={item.href}
                        item={item}
                        index={index}
                        onNavigate={closeMenu}
                        shouldReduceMotion={
                          shouldReduceMotion
                        }
                      />
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Bottom area */}

              <div className="grid grid-cols-1 gap-5 border-t border-ink/10 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                {/* Status */}

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
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : 0.45,
                    ease: EASE,
                  }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span
                        className="
                          absolute
                          inline-flex
                          h-full
                          w-full
                          animate-ping
                          rounded-full
                          bg-sage
                          opacity-60
                        "
                      />

                      <span
                        className="
                          relative
                          inline-flex
                          h-2
                          w-2
                          rounded-full
                          bg-sage
                        "
                      />
                    </span>

                    <span className="text-label text-ink">
                      Open today
                    </span>
                  </div>

                  <p className="max-w-xs text-sm leading-relaxed text-smoke">
                    Monday — Saturday
                    <br />
                    09:00 — 20:00
                  </p>
                </motion.div>

                {/* Booking */}

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
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : 0.5,
                    ease: EASE,
                  }}
                >
                  <Link
                    href="/booking"
                    onClick={closeMenu}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      gap-8
                      rounded-full
                      bg-ink
                      px-6
                      py-4
                      text-parchment
                      transition-transform
                      duration-500
                      ease-[var(--ease-editorial)]
                      hover:-translate-y-1
                    "
                  >
                    <span
                      className="
                        text-[0.68rem]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                      "
                    >
                      Reserve a Chair
                    </span>

                    <span
                      aria-hidden="true"
                      className="
                        text-base
                        transition-transform
                        duration-500
                        ease-[var(--ease-editorial)]
                        group-hover:translate-x-1
                      "
                    >
                      ↗
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


/* ─────────────────────────────────────────────
   DESKTOP NAV LINK
───────────────────────────────────────────── */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        py-2
        text-label
        text-ink/75
        transition-colors
        duration-300
        hover:text-ink
      "
    >
      {children}

      <span
        className="
          absolute
          inset-x-0
          bottom-0
          h-px
          origin-left
          scale-x-0
          bg-terracotta
          transition-transform
          duration-500
          ease-[var(--ease-editorial)]
          group-hover:scale-x-100
        "
      />
    </Link>
  );
}


/* ─────────────────────────────────────────────
   MOBILE NAV ITEM
───────────────────────────────────────────── */

function MobileNavItem({
  item,
  index,
  onNavigate,
  shouldReduceMotion,
}: {
  item: (typeof navigation)[number];
  index: number;
  onNavigate: () => void;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.li
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 16,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion
          ? 0
          : 0.12 + index * 0.08,
        ease: EASE,
      }}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        className="
          group
          relative
          flex
          items-center
          justify-between
          py-6
          sm:py-7
        "
      >
        <div className="flex items-baseline gap-5 sm:gap-7">
          <span
            className="
              text-label
              text-terracotta
              transition-colors
              duration-500
              group-hover:text-burnt-amber
            "
          >
            {item.number}
          </span>

          <div>
            <span
              className="
                block
                font-display
                text-[2.65rem]
                font-normal
                tracking-[-0.045em]
                text-ink
                transition-transform
                duration-700
                ease-[var(--ease-editorial)]
                group-hover:translate-x-2
                sm:text-[3.4rem]
              "
            >
              {item.label}
            </span>

            <span
              className="
                mt-1
                block
                max-w-[15rem]
                text-xs
                leading-relaxed
                text-smoke
                sm:text-sm
              "
            >
              {item.description}
            </span>
          </div>
        </div>

        {/* Arrow / interaction mark */}

        <span
          aria-hidden="true"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-ink/10
            text-ink
            transition-all
            duration-700
            ease-[var(--ease-editorial)]
            group-hover:border-terracotta
            group-hover:bg-terracotta
            group-hover:text-parchment
            sm:h-12
            sm:w-12
          "
        >
          <span
            className="
              text-lg
              transition-transform
              duration-500
              ease-[var(--ease-editorial)]
              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          >
            ↗
          </span>
        </span>

        {/* Hover underline */}

        <span
          aria-hidden="true"
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-full
            origin-left
            scale-x-0
            bg-terracotta
            transition-transform
            duration-700
            ease-[var(--ease-editorial)]
            group-hover:scale-x-100
          "
        />
      </Link>
    </motion.li>
  );
}


/* ─────────────────────────────────────────────
   CUSTOM MOBILE MENU ARTWORK

   No external images.
   Pure SVG geometry.
───────────────────────────────────────────── */

function MenuArtwork() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 1000"
      preserveAspectRatio="none"
      className="
        pointer-events-none
        absolute
        inset-0
        h-full
        w-full
        text-ink
        opacity-[0.055]
      "
    >
      {/* Large architectural circle */}

      <circle
        cx="690"
        cy="170"
        r="220"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle
        cx="690"
        cy="170"
        r="174"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle
        cx="690"
        cy="170"
        r="4"
        fill="currentColor"
      />

      {/* Editorial grid */}

      <path
        d="M520 0V1000"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <path
        d="M640 0V1000"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <path
        d="M0 180H800"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <path
        d="M0 820H800"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Diagonal architectural line */}

      <path
        d="M0 720L800 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Fine secondary diagonal */}

      <path
        d="M180 1000L800 520"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Brass-like accent geometry */}

      <path
        d="M620 0L800 180"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        opacity="0.8"
      />

      <path
        d="M520 820L800 820"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Small registration marks */}

      <path
        d="M38 180H68M53 165V195"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <path
        d="M720 820H750M735 805V835"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Small geometric diamond */}

      <path
        d="M610 720L630 740L610 760L590 740Z"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
      />
    </svg>
  );
}