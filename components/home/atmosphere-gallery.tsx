"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const images = {
  interior:
    "https://images.pexels.com/photos/7518728/pexels-photo-7518728.jpeg?auto=compress&cs=tinysrgb&w=1800",

  detail:
    "https://images.pexels.com/photos/8218487/pexels-photo-8218487.jpeg?auto=compress&cs=tinysrgb&w=1400",

  ritual:
    "https://images.pexels.com/photos/7697329/pexels-photo-7697329.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

export function AtmosphereGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const heroImageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", "8%"],
  );

  const detailImageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["8%", "-8%"],
  );

  return (
    <section
      ref={sectionRef}
      id="house"
      className="relative overflow-hidden bg-bone"
    >
      {/* =========================================================
          INTRO
      ========================================================= */}

      <div className="editorial-container relative z-10 pt-28 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36">
        <div className="grid grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.9,
              ease: EASE,
            }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-terracotta" />

              <span className="text-eyebrow text-ink/50">
                02 / The House
              </span>
            </div>

            <div className="mt-8 overflow-hidden">
              <motion.h2
                initial={{ y: "105%" }}
                whileInView={{ y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.35,
                }}
                transition={{
                  duration: 1,
                  ease: EASE,
                }}
                className="
                  max-w-[850px]
                  font-display
                  text-[clamp(3.8rem,8vw,8.5rem)]
                  font-normal
                  leading-[0.82]
                  tracking-[-0.06em]
                  text-ink
                "
              >
                More than
                <br />
                <span className="italic text-terracotta">
                  a haircut.
                </span>
              </motion.h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: EASE,
            }}
            className="
              col-span-12
              mt-10
              lg:col-span-4
              lg:col-start-9
              lg:mt-auto
            "
          >
            <div className="border-t border-ink/15 pt-5">
              <p className="max-w-[360px] text-sm leading-7 text-smoke sm:text-base">
                A considered space for the rituals that
                make you feel like yourself again.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-eyebrow text-ink/35">
                  VAREL
                </span>

                <span className="h-px w-8 bg-ink/15" />

                <span className="text-eyebrow text-ink/35">
                  EST. 2026
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          EDITORIAL IMAGE COMPOSITION
      ========================================================= */}

      <div className="relative">
        {/* Large image */}

        <motion.div
          initial={{
            opacity: 0,
            clipPath: "inset(8% 0 8% 0)",
          }}
          whileInView={{
            opacity: 1,
            clipPath: "inset(0% 0 0% 0)",
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1.25,
            ease: EASE,
          }}
          className="
            relative
            ml-auto
            aspect-[4/3]
            w-[92%]
            overflow-hidden
            lg:aspect-[16/9]
            lg:w-[79%]
          "
        >
          <motion.img
            src={images.interior}
            alt="Warm contemporary barber shop interior"
            style={{ y: heroImageY }}
            className="
              absolute
              inset-0
              h-[116%]
              w-full
              object-cover
              object-center
              saturate-[0.65]
              contrast-[1.08]
              brightness-[0.82]
              sepia-[0.1]
            "
          />

          {/* Warm cinematic grade */}
          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(110deg,rgba(20,17,15,0.18),transparent_45%,rgba(194,89,63,0.18))]
              mix-blend-multiply
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_65%_45%,rgba(194,89,63,0.16),transparent_42%)]
              mix-blend-color
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(to_bottom,transparent_60%,rgba(20,17,15,0.38))]
            "
          />

          {/* Image caption */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-parchment sm:bottom-8 sm:left-8">
            <span className="h-px w-8 bg-parchment/50" />

            <span className="text-eyebrow text-parchment/80">
              The house
            </span>
          </div>
        </motion.div>

        {/* =====================================================
            FLOATING DETAIL IMAGE
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -50,
            y: 70,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: EASE,
          }}
          className="
            absolute
            left-[6%]
            top-[48%]
            hidden
            aspect-[3/4]
            w-[25%]
            overflow-hidden
            lg:block
          "
        >
          <motion.img
            src={images.detail}
            alt="Classic barber shop interior with vintage chairs"
            style={{ y: detailImageY }}
            className="
              absolute
              inset-0
              h-[118%]
              w-full
              object-cover
              saturate-[0.6]
              contrast-[1.12]
              brightness-[0.76]
              sepia-[0.13]
            "
          />

          <div className="absolute inset-0 bg-sage/10 mix-blend-color" />

          <div className="absolute inset-x-5 bottom-5">
            <span className="text-eyebrow text-parchment/80">
              Character
            </span>
          </div>
        </motion.div>

        {/* =====================================================
            SMALL RITUAL IMAGE
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 45,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.95,
            delay: 0.3,
            ease: EASE,
          }}
          className="
            absolute
            bottom-[-18%]
            right-[7%]
            hidden
            aspect-[4/3]
            w-[27%]
            overflow-hidden
            lg:block
          "
        >
          <img
            src={images.ritual}
            alt="Barber and clients sharing the grooming experience"
            className="
              h-full
              w-full
              object-cover
              saturate-[0.58]
              contrast-[1.08]
              brightness-[0.78]
              sepia-[0.1]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(135deg,rgba(194,89,63,0.12),transparent_55%)]
              mix-blend-color
            "
          />
        </motion.div>

        {/* Vertical editorial marker */}

        <div
          className="
            absolute
            right-[2.5%]
            top-1/2
            hidden
            -translate-y-1/2
            items-center
            gap-4
            xl:flex
          "
        >
          <span className="text-eyebrow text-ink/30">02</span>

          <span className="h-px w-12 bg-ink/15" />

          <span className="text-eyebrow text-ink/30 [writing-mode:vertical-rl]">
            THE HOUSE
          </span>
        </div>
      </div>

      {/* =========================================================
          STATEMENT
      ========================================================= */}

      <div className="editorial-container relative z-10 pb-32 pt-36 md:pb-40 md:pt-48 lg:pb-56 lg:pt-64">
        <div className="grid grid-cols-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
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
              duration: 1,
              ease: EASE,
            }}
            className="col-span-12 lg:col-span-8"
          >
            <p className="font-display text-[clamp(2.8rem,5.5vw,6rem)] leading-[0.9] tracking-[-0.045em] text-ink">
              Take a moment.
              <br />
              Take your time.
              <br />
              <span className="italic text-terracotta">
                Leave sharper.
              </span>
            </p>
          </motion.div>

          <motion.div
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
              amount: 0.35,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: EASE,
            }}
            className="
              col-span-12
              mt-12
              lg:col-span-3
              lg:col-start-10
              lg:mt-auto
            "
          >
            <p className="text-sm leading-7 text-smoke">
              From the chair to the conversation, every
              detail is considered. VAREL is designed around
              the simple pleasure of taking time for yourself.
            </p>

            <div className="mt-8 h-px w-full bg-ink/15" />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-label text-ink/45">
                Precision
              </span>

              <span className="text-label text-ink/45">
                Ritual
              </span>

              <span className="text-label text-ink/45">
                Character
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          TERRACOTTA TRANSITION
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
          h-px
          w-full
          origin-left
          bg-terracotta/40
        "
      />
    </section>
  );
}