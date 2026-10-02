"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const navigation = [
  {
    label: "The House",
    href: "#house",
  },
  {
    label: "Artisans",
    href: "#artisans",
  },
  {
    label: "Services",
    href: "#services",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="editorial-container">
        <nav
          aria-label="Main navigation"
          className="
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
            className="
              group
              relative
              z-10
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

            <span
              className="
                ml-2
                h-1
                w-1
                rounded-full
                bg-terracotta
                transition-transform
                duration-500
                ease-[var(--ease-editorial)]
                group-hover:scale-[1.8]
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

          <div className="flex items-center gap-4">
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


            {/* Booking CTA */}

            <motion.a
              href="#booking"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
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
                md:flex
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


            {/* Mobile menu trigger */}

            <button
              type="button"
              aria-label="Open menu"
              className="
                flex
                h-11
                w-11
                flex-col
                items-center
                justify-center
                gap-1.5
                rounded-full
                border
                border-ink/15
                bg-parchment/70
                backdrop-blur-md
                md:hidden
              "
            >
              <span className="h-px w-4 bg-ink" />
              <span className="h-px w-4 bg-ink" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}


/* ─────────────────────────────────────────────
   NAV LINK
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