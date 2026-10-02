"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", "8%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.06, 1.12],
  );

  const statementY = useTransform(
    scrollYProgress,
    [0, 1],
    ["8%", "-8%"],
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-terracotta text-parchment"
    >
      {/* =========================================================
          ATMOSPHERIC BACKGROUND
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_75%_35%,rgba(247,244,239,0.1),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(20,17,15,0.12),transparent_35%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          grain
          pointer-events-none
          absolute
          inset-0
          opacity-30
        "
      />

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="editorial-container relative z-10 py-32 md:py-44 lg:py-56">
        {/* Section marker */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.8,
            ease: EASE,
          }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-10 bg-parchment/60" />

          <span className="text-eyebrow text-parchment/70">
            05 / The Philosophy
          </span>
        </motion.div>

        {/* =====================================================
            PRIMARY STATEMENT
        ===================================================== */}

        <div className="relative mt-12 lg:mt-16">
          <motion.div
            style={{ y: statementY }}
            className="relative z-10 max-w-[1100px]"
          >
            <div className="overflow-hidden">
              <motion.h2
                initial={{
                  y: "105%",
                }}
                whileInView={{
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 1.1,
                  ease: EASE,
                }}
                className="
                  font-display
                  text-[clamp(4rem,9vw,10rem)]
                  font-normal
                  leading-[0.78]
                  tracking-[-0.065em]
                "
              >
                Grooming
                <br />
                is a
                <br />
                <span className="italic text-parchment/75">
                  ritual.
                </span>
              </motion.h2>
            </div>
          </motion.div>

          {/* ===================================================
              FLOATING IMAGE
          =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              x: 40,
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
              mt-14
              ml-auto
              aspect-[4/5]
              w-[68%]
              overflow-hidden
              sm:w-[52%]
              lg:absolute
              lg:right-[3%]
              lg:top-[18%]
              lg:mt-0
              lg:w-[31%]
            "
          >
            <motion.div
              style={{
                y: imageY,
                scale: imageScale,
              }}
              className="absolute inset-[-6%]"
            >
              <Image
                src="https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Barber carefully styling a client's hair"
                fill
                sizes="(max-width: 1024px) 68vw, 31vw"
                className="
                  object-cover
                  saturate-[0.62]
                  contrast-[1.08]
                  brightness-[0.78]
                  sepia-[0.1]
                "
              />
            </motion.div>

            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(145deg,rgba(194,89,63,0.16),transparent_50%,rgba(20,17,15,0.28))]
                mix-blend-color
              "
            />

            <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
              <span className="text-eyebrow text-parchment/75">
                Take your time
              </span>
            </div>
          </motion.div>
        </div>

        {/* =====================================================
            PHILOSOPHY COPY
        ===================================================== */}

        <div className="relative z-10 mt-24 grid grid-cols-12 gap-y-12 lg:mt-36">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.9,
              ease: EASE,
            }}
            className="col-span-12 lg:col-span-5"
          >
            <p className="text-eyebrow text-parchment/60">
              Our belief
            </p>

            <p className="mt-6 max-w-[430px] text-lg leading-8 text-parchment/85 sm:text-xl">
              The best grooming experiences are not
              rushed. They are deliberate, personal, and
              quietly transformative.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.9,
              delay: 0.12,
              ease: EASE,
            }}
            className="col-span-12 lg:col-span-4 lg:col-start-8"
          >
            <p className="text-sm leading-7 text-parchment/60">
              We believe in knowing the difference between
              enough and exceptional. The right cut. The
              right conversation. The final detail at the
              collar.
            </p>

            <p className="mt-6 text-sm leading-7 text-parchment/60">
              Nothing excessive. Nothing accidental.
              Just considered craft, delivered with time
              and intention.
            </p>
          </motion.div>
        </div>

        {/* =====================================================
            PRINCIPLES
        ===================================================== */}

        <div className="mt-24 border-t border-parchment/20 lg:mt-36">
          <div className="grid grid-cols-12">
            {[
              {
                number: "01",
                title: "Precision",
                text: "Every line, transition, and finish has a purpose.",
              },
              {
                number: "02",
                title: "Presence",
                text: "A moment to disconnect, sit back, and be looked after.",
              },
              {
                number: "03",
                title: "Character",
                text: "Your style should feel like yours, not something copied.",
              },
            ].map((principle, index) => (
              <motion.div
                key={principle.number}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: EASE,
                }}
                className="
                  col-span-12
                  border-b
                  border-parchment/20
                  py-8
                  sm:col-span-4
                  sm:border-b-0
                  sm:border-r
                  sm:px-7
                  sm:first:pl-0
                  sm:last:border-r-0
                  sm:last:pr-0
                  lg:py-10
                "
              >
                <span className="text-eyebrow text-parchment/45">
                  {principle.number}
                </span>

                <h3 className="mt-5 font-display text-3xl tracking-[-0.025em] text-parchment">
                  {principle.title}
                </h3>

                <p className="mt-4 max-w-[230px] text-sm leading-6 text-parchment/50">
                  {principle.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          TRANSITION TO NEXT SECTION
      ========================================================= */}

      <motion.div
        initial={{
          scaleX: 0,
        }}
        whileInView={{
          scaleX: 1,
        }}
        viewport={{
          once: true,
          amount: 0.8,
        }}
        transition={{
          duration: 1.2,
          ease: EASE,
        }}
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          origin-left
          bg-parchment/30
        "
      />
    </section>
  );
}