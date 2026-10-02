"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ClosingCta() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-10%", "10%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.08, 1.15],
  );

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="
        relative
        overflow-hidden
        bg-midnight-oak
        text-parchment
      "
    >
      {/* Ambient colour */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_75%_30%,rgba(194,89,63,0.13),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(139,146,117,0.07),transparent_30%)]
        "
      />

      {/* Grain */}
      <div
        aria-hidden="true"
        className="
          grain
          pointer-events-none
          absolute
          inset-0
          opacity-50
        "
      />

      <div className="editorial-container relative z-10">
        {/* Top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{
            duration: 1.2,
            ease: EASE,
          }}
          className="
            h-px
            w-full
            origin-left
            bg-parchment/15
          "
        />

        <div className="relative py-28 md:py-40 lg:py-52">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.8,
              ease: EASE,
            }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-10 bg-terracotta" />

            <span className="text-eyebrow text-parchment/45">
              06 / Your chair awaits
            </span>
          </motion.div>

          {/* Main composition */}
          <div className="relative mt-12 lg:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1,
                ease: EASE,
              }}
              className="relative z-10 max-w-[1050px]"
            >
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "105%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 1.15,
                    ease: EASE,
                  }}
                  className="
                    font-display
                    text-[clamp(4rem,9.5vw,10.5rem)]
                    font-normal
                    leading-[0.78]
                    tracking-[-0.065em]
                    text-parchment
                  "
                >
                  Make time
                  <br />
                  for{" "}
                  <span className="italic text-terracotta">
                    yourself.
                  </span>
                </motion.h2>
              </div>
            </motion.div>

            {/* Floating image */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                x: 45,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 1.1,
                delay: 0.2,
                ease: EASE,
              }}
              className="
                relative
                mt-12
                ml-auto
                aspect-[4/5]
                w-[72%]
                overflow-hidden
                sm:w-[52%]
                lg:absolute
                lg:right-[2%]
                lg:top-[16%]
                lg:mt-0
                lg:w-[29%]
              "
            >
              <motion.div
                style={{
                  y: imageY,
                  scale: imageScale,
                }}
                className="absolute inset-[-7%]"
              >
                <Image
                  src="https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="Barber finishing a client's haircut"
                  fill
                  sizes="(max-width: 1024px) 72vw, 29vw"
                  className="
                    object-cover
                    saturate-[0.5]
                    contrast-[1.12]
                    brightness-[0.58]
                    sepia-[0.12]
                  "
                />
              </motion.div>

              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(135deg,rgba(194,89,63,0.16),transparent_48%,rgba(20,17,15,0.45))]
                  mix-blend-color
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(to_bottom,transparent_45%,rgba(20,17,15,0.65))]
                "
              />

              <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                <span className="text-eyebrow text-parchment/65">
                  The final detail
                </span>
              </div>
            </motion.div>
          </div>

          {/* CTA + details */}
          <div className="relative z-10 mt-20 grid grid-cols-12 gap-y-14 lg:mt-32">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.9,
                ease: EASE,
              }}
              className="col-span-12 lg:col-span-5"
            >
              <p className="max-w-[390px] text-sm leading-7 text-parchment/55 sm:text-base">
                Come in for the cut. Stay for the ritual.
                Leave feeling like yourself, only sharper.
              </p>

              <motion.a
                href="#booking"
                whileHover={{
                  y: -3,
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
                  mt-8
                  inline-flex
                  items-center
                  gap-4
                  rounded-full
                  bg-terracotta
                  px-6
                  py-4
                  text-[0.68rem]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-parchment
                "
              >
                <span>Reserve a Chair</span>

                <span
                  className="
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.9,
                delay: 0.12,
                ease: EASE,
              }}
              className="
                col-span-12
                grid
                grid-cols-2
                gap-8
                border-t
                border-parchment/15
                pt-6
                sm:grid-cols-3
                lg:col-span-6
                lg:col-start-7
              "
            >
              <div>
                <span className="text-eyebrow text-parchment/30">
                  Visit
                </span>

                <p className="mt-4 text-sm leading-6 text-parchment/65">
                  14 Victoria Island
                  <br />
                  Lagos, Nigeria
                </p>
              </div>

              <div>
                <span className="text-eyebrow text-parchment/30">
                  Hours
                </span>

                <p className="mt-4 text-sm leading-6 text-parchment/65">
                  Mon — Sat
                  <br />
                  9 AM — 8 PM
                </p>
              </div>

              <div>
                <span className="text-eyebrow text-parchment/30">
                  Contact
                </span>

                <p className="mt-4 text-sm leading-6 text-parchment/65">
                  +234 800 000 0000
                  <br />
                  hello@varel.ng
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Closing brand line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="
            flex
            flex-col
            gap-5
            border-t
            border-parchment/15
            py-7
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span className="font-display text-2xl tracking-[-0.035em] text-parchment">
            VAREL
            <span className="ml-1 text-terracotta">.</span>
          </span>

          <div className="flex items-center gap-5">
            <span className="text-label text-parchment/30">
              Modern Grooming
            </span>

            <span className="h-px w-8 bg-parchment/15" />

            <span className="text-label text-parchment/30">
              Est. 2026
            </span>
          </div>

          <span className="text-label text-parchment/25">
            The art of looking sharp.
          </span>
        </motion.div>
      </div>
    </section>
  );
}