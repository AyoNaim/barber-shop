"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    number: "01",
    name: "The VAREL Cut",
    description:
      "A considered cut shaped around your features, texture, and personal style. Finished with a precision neck clean-up.",
    duration: "45 min",
    price: "₦12,000",
  },
  {
    number: "02",
    name: "Signature Fade",
    description:
      "A precision fade with seamless transitions, tailored proportions, and a clean finish designed to grow out beautifully.",
    duration: "50 min",
    price: "₦14,000",
  },
  {
    number: "03",
    name: "The Beard Ritual",
    description:
      "Sculpt, refine, and restore. A detailed beard service finished with warm towel treatment and nourishing oils.",
    duration: "35 min",
    price: "₦9,000",
  },
  {
    number: "04",
    name: "Cut + Beard",
    description:
      "The complete VAREL ritual. Precision haircut paired with a tailored beard shape and finishing treatment.",
    duration: "70 min",
    price: "₦19,000",
  },
  {
    number: "05",
    name: "The Full Ritual",
    description:
      "Cut, beard, hot towel, scalp treatment, and finishing ritual. Time deliberately set aside for the complete experience.",
    duration: "90 min",
    price: "₦25,000",
  },
];

export function ServiceMenu() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-10%", "10%"],
  );

  const headingY = useTransform(
    scrollYProgress,
    [0, 1],
    ["10%", "-10%"],
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="
        relative
        overflow-hidden
        bg-midnight-oak
        text-parchment
      "
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
          bg-[radial-gradient(circle_at_75%_25%,rgba(194,89,63,0.16),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(139,146,117,0.08),transparent_28%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          grain
          pointer-events-none
          absolute
          inset-0
          opacity-40
        "
      />

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="editorial-container relative z-10 section-lg">
        <div className="grid grid-cols-12 gap-y-12">
          <motion.div
            style={{ y: headingY }}
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.9,
              ease: EASE,
            }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-terracotta" />

              <span className="text-eyebrow text-parchment/45">
                04 / The Menu
              </span>
            </div>

            <div className="mt-8 overflow-hidden">
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
                  duration: 1.05,
                  ease: EASE,
                }}
                className="
                  font-display
                  text-[clamp(4rem,8vw,9rem)]
                  font-normal
                  leading-[0.8]
                  tracking-[-0.06em]
                  text-parchment
                "
              >
                The craft
                <br />
                of looking
                <br />
                <span className="italic text-terracotta">
                  sharp.
                </span>
              </motion.h2>
            </div>
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: EASE,
            }}
            className="
              col-span-12
              flex
              items-end
              lg:col-span-4
              lg:col-start-9
            "
          >
            <div className="border-t border-parchment/15 pt-5">
              <p className="max-w-[350px] text-sm leading-7 text-parchment/60 sm:text-base">
                Every service begins with consultation,
                continues with precision, and ends with the
                details that make the difference.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-eyebrow text-brass-light/70">
                  Precision
                </span>

                <span className="h-px w-6 bg-brass/40" />

                <span className="text-eyebrow text-brass-light/70">
                  Time
                </span>

                <span className="h-px w-6 bg-brass/40" />

                <span className="text-eyebrow text-brass-light/70">
                  Detail
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================================
            MENU
        ========================================================= */}

        <div className="mt-24 grid grid-cols-12 gap-x-8 lg:mt-36">
          {/* Image / visual side */}

          <div className="relative col-span-12 mb-16 lg:col-span-4 lg:mb-0">
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
                duration: 1.15,
                ease: EASE,
              }}
              className="
                relative
                aspect-[3/4]
                overflow-hidden
              "
            >
              <motion.div
                style={{ y: imageY }}
                className="absolute inset-x-0 -top-[10%] h-[120%]"
              >
                <Image
                  src="https://images.pexels.com/photos/17027433/pexels-photo-17027433.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Moody barbershop interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="
                    object-cover
                    saturate-[0.55]
                    contrast-[1.15]
                    brightness-[0.62]
                    sepia-[0.12]
                  "
                />
              </motion.div>

              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(135deg,rgba(194,89,63,0.16),transparent_45%,rgba(20,17,15,0.42))]
                  mix-blend-color
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(to_bottom,transparent_45%,rgba(20,17,15,0.72))]
                "
              />

              <div className="absolute inset-x-6 bottom-6">
                <span className="text-eyebrow text-parchment/60">
                  The VAREL ritual
                </span>

                <p className="mt-3 max-w-[230px] font-display text-2xl leading-[0.95] tracking-[-0.025em] text-parchment">
                  Time well spent is part of the service.
                </p>
              </div>
            </motion.div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-eyebrow text-parchment/30">
                04
              </span>

              <span className="text-label text-parchment/30">
                Services / 2026
              </span>
            </div>
          </div>

          {/* Service list */}

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="border-t border-parchment/15">
              {services.map((service, index) => {
                const isActive = activeService === index;

                return (
                  <motion.div
                    key={service.number}
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: index * 0.07,
                      ease: EASE,
                    }}
                    className="border-b border-parchment/15"
                  >
                    <button
                      type="button"
                      onMouseEnter={() =>
                        setActiveService(index)
                      }
                      onFocus={() =>
                        setActiveService(index)
                      }
                      onClick={() =>
                        setActiveService(
                          isActive ? -1 : index,
                        )
                      }
                      aria-expanded={isActive}
                      className="
                        group
                        flex
                        w-full
                        items-start
                        gap-5
                        py-7
                        text-left
                        sm:py-8
                        lg:py-9
                      "
                    >
                      {/* Number */}

                      <span
                        className={`
                          pt-2
                          text-eyebrow
                          transition-colors
                          duration-500
                          ${
                            isActive
                              ? "text-terracotta"
                              : "text-parchment/25"
                          }
                        `}
                      >
                        {service.number}
                      </span>

                      {/* Main content */}

                      <span className="min-w-0 flex-1">
                        <span
                          className={`
                            block
                            font-display
                            text-[clamp(1.8rem,3.4vw,3.5rem)]
                            leading-[0.95]
                            tracking-[-0.035em]
                            transition-colors
                            duration-500
                            ${
                              isActive
                                ? "text-parchment"
                                : "text-parchment/55"
                            }
                          `}
                        >
                          {service.name}
                        </span>

                        <motion.span
                          initial={false}
                          animate={{
                            height: isActive
                              ? "auto"
                              : 0,
                            opacity: isActive ? 1 : 0,
                            marginTop: isActive
                              ? 16
                              : 0,
                          }}
                          transition={{
                            duration: 0.5,
                            ease: EASE,
                          }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-[470px] text-sm leading-6 text-parchment/50">
                            {service.description}
                          </span>

                          <span className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                            <span className="text-label text-brass-light/70">
                              {service.duration}
                            </span>

                            <span className="h-3 w-px bg-parchment/15" />

                            <span className="text-label text-brass-light/70">
                              Personal consultation
                            </span>
                          </span>
                        </motion.span>
                      </span>

                      {/* Price */}

                      <span
                        className={`
                          shrink-0
                          pt-1
                          font-sans
                          text-sm
                          font-medium
                          tracking-[0.02em]
                          transition-colors
                          duration-500
                          sm:text-base
                          ${
                            isActive
                              ? "text-brass-light"
                              : "text-parchment/35"
                          }
                        `}
                      >
                        {service.price}
                      </span>

                      {/* Arrow */}

                      <span
                        className={`
                          mt-1
                          hidden
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          transition-all
                          duration-500
                          sm:flex
                          ${
                            isActive
                              ? "border-terracotta bg-terracotta text-parchment"
                              : "border-parchment/15 text-parchment/30"
                          }
                        `}
                      >
                        <motion.span
                          animate={{
                            rotate: isActive ? 45 : 0,
                          }}
                          transition={{
                            duration: 0.45,
                            ease: EASE,
                          }}
                        >
                          ↗
                        </motion.span>
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Menu footer */}

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
                amount: 0.4,
              }}
              transition={{
                duration: 0.8,
                ease: EASE,
              }}
              className="
                flex
                flex-col
                gap-6
                pt-8
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p className="max-w-[300px] text-xs leading-5 text-parchment/35">
                Prices are a starting point. Your barber will
                recommend the appropriate service after a
                short consultation.
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
                  inline-flex
                  items-center
                  gap-4
                  self-start
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
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM ACCENT
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
          bg-brass/30
        "
      />
    </section>
  );
}