"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function EditorialHero() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "18%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.04, 1.12],
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-12%"],
  );

  return (
    <section
      ref={containerRef}
      className="
        relative
        min-h-[100svh]
        overflow-hidden
        bg-parchment
      "
    >
      {/* ─────────────────────────────────────
          IMAGE
      ───────────────────────────────────── */}

      <div
        className="
          absolute
          inset-y-0
          right-0
          w-full
          lg:w-[57%]
        "
      >
        <motion.div
          style={{
            y: imageY,
            scale: imageScale,
          }}
          className="absolute inset-0"
        >
          <Image
            src="/barber-hero.jpg"
            alt="A client receiving a haircut inside a modern barbershop"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 57vw"
            className="
              object-cover
              object-[58%_center]
              saturate-[0.72]
              contrast-[1.08]
              brightness-[0.78]
              sepia-[0.12]
            "
          />

          {/* Warm cinematic treatment */}

          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(90deg,#f7f4ef_0%,rgba(247,244,239,0.86)_4%,rgba(20,17,15,0.05)_34%,rgba(20,17,15,0.18)_100%)]
              lg:bg-[linear-gradient(90deg,#f7f4ef_0%,rgba(247,244,239,0.72)_8%,rgba(20,17,15,0.04)_38%,rgba(20,17,15,0.25)_100%)]
            "
          />

          {/* Terracotta wash */}

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_75%_50%,rgba(194,89,63,0.16),transparent_42%)]
              mix-blend-color
            "
          />

          {/* Editorial vignette */}

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,transparent_30%,rgba(20,17,15,0.28)_100%)]
            "
          />
        </motion.div>
      </div>


      {/* ─────────────────────────────────────
          GRAIN
      ───────────────────────────────────── */}

      <div className="grain absolute inset-0 z-[1] pointer-events-none" />


      {/* ─────────────────────────────────────
          CONTENT
      ───────────────────────────────────── */}

      <motion.div
        style={{ y: contentY }}
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          items-center
        "
      >
        <div className="editorial-container w-full">
          <div
            className="
              grid
              grid-cols-12
              items-center
            "
          >
            <div
              className="
                col-span-12
                pt-28
                pb-20
                lg:col-span-8
                lg:pt-20
              "
            >
              {/* ─────────────────────────────
                  EYEBROW
              ───────────────────────────── */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: EASE,
                }}
                className="mb-7 flex items-center gap-3"
              >
                <span className="h-px w-8 bg-terracotta" />

                <span className="text-eyebrow text-ink/70">
                  Modern Grooming Lounge
                </span>
              </motion.div>


              {/* ─────────────────────────────
                  HEADLINE
              ───────────────────────────── */}

              <div className="overflow-hidden">
                <motion.h1
                  initial={{
                    y: "105%",
                  }}
                  animate={{
                    y: 0,
                  }}
                  transition={{
                    duration: 1.15,
                    delay: 0.25,
                    ease: EASE,
                  }}
                  className="
                    max-w-[900px]
                    font-display
                    text-[clamp(4rem,9vw,9rem)]
                    font-normal
                    leading-[0.82]
                    tracking-[-0.055em]
                    text-ink
                  "
                >
                  The art
                  <br />
                  of looking
                  <br />
                  <span className="italic text-terracotta">
                    sharp.
                  </span>
                </motion.h1>
              </div>


              {/* ─────────────────────────────
                  DESCRIPTION
              ───────────────────────────── */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.65,
                  ease: EASE,
                }}
                className="
                  mt-8
                  max-w-[390px]
                  text-sm
                  leading-7
                  text-ink/65
                  sm:text-base
                "
              >
                Precision cuts, considered shaves, and
                timeless grooming rituals crafted for the
                modern gentleman.
              </motion.p>


              {/* ─────────────────────────────
                  ACTIONS
              ───────────────────────────── */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: EASE,
                }}
                className="
                  mt-9
                  flex
                  flex-wrap
                  items-center
                  gap-5
                "
              >
                <MagneticButton />

                <Link
                  href="#services"
                  className="
                    group
                    text-label
                    text-ink/65
                    transition-colors
                    duration-300
                    hover:text-ink
                  "
                >
                  Explore services

                  <span
                    className="
                      ml-2
                      inline-block
                      transition-transform
                      duration-500
                      ease-[var(--ease-editorial)]
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>


      {/* ─────────────────────────────────────
          OPEN STATUS
      ───────────────────────────────────── */}

      <motion.div
        initial={{
          opacity: 0,
          x: 20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 1,
          ease: EASE,
        }}
        className="
          absolute
          bottom-8
          right-6
          z-20
          flex
          items-center
          gap-3
          rounded-full
          border
          border-parchment/20
          bg-oak/70
          px-4
          py-3
          text-parchment
          backdrop-blur-md
          sm:right-10
        "
      >
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

        <span className="text-label">
          Open today
        </span>

        <span className="h-3 w-px bg-parchment/20" />

        <span className="text-[0.65rem] tracking-[0.08em] text-parchment/65">
          Until 8 PM
        </span>
      </motion.div>


      {/* ─────────────────────────────────────
          VERTICAL INDEX
      ───────────────────────────────────── */}

      <div
        className="
          absolute
          bottom-8
          left-6
          z-20
          hidden
          items-center
          gap-4
          lg:flex
          lg:left-10
        "
      >
        <span className="text-eyebrow text-ink/40">
          01
        </span>

        <span className="h-px w-10 bg-ink/20" />

        <span className="text-eyebrow text-ink/40">
          The House
        </span>
      </div>


      {/* ─────────────────────────────────────
          SCROLL INDICATOR
      ───────────────────────────────────── */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1.4,
        }}
        className="
          absolute
          bottom-8
          left-1/2
          z-20
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-3
          lg:flex
        "
      >
        <span className="text-eyebrow text-ink/40">
          Scroll
        </span>

        <motion.span
          animate={{
            scaleY: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            h-8
            w-px
            origin-top
            bg-ink/30
          "
        />
      </motion.div>
    </section>
  );
}


/* ─────────────────────────────────────────────
   MAGNETIC CTA
───────────────────────────────────────────── */

function MagneticButton() {
  return (
    <motion.a
      href="/booking"
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        duration: 0.4,
        ease: EASE,
      }}
      className="
        group
        relative
        inline-flex
        items-center
        gap-4
        overflow-hidden
        rounded-full
        bg-terracotta
        px-6
        py-4
        text-[0.68rem]
        font-semibold
        uppercase
        tracking-[0.15em]
        text-parchment
        shadow-editorial
      "
    >
      <span
        className="
          absolute
          inset-0
          -translate-x-full
          bg-burnt-amber
          transition-transform
          duration-500
          ease-[var(--ease-editorial)]
          group-hover:translate-x-0
        "
      />

      <span className="relative z-10">
        Reserve a Chair
      </span>

      <span
        className="
          relative
          z-10
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          border
          border-parchment/30
          transition-transform
          duration-500
          ease-[var(--ease-editorial)]
          group-hover:translate-x-1
        "
      >
        ↗
      </span>
    </motion.a>
  );
}