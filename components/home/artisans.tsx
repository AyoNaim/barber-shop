"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const artisans = [
  {
    name: "Marco Vale",
    role: "Founder / Master Barber",
    number: "01",
    image:
      "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    name: "Julian Reed",
    role: "Senior Barber",
    number: "02",
    image:
      "https://images.pexels.com/photos/4625627/pexels-photo-4625627.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Elias Cole",
    role: "Grooming Specialist",
    number: "03",
    image:
      "https://images.pexels.com/photos/7697434/pexels-photo-7697434.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export function Artisans() {
  return (
    <section
      id="artisans"
      className="surface-parchment overflow-hidden"
    >
      <div className="editorial-container section-lg">
        {/* Section introduction */}
        <div className="grid grid-cols-12 gap-y-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.8,
              ease: EASE,
            }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-terracotta" />

              <span className="text-eyebrow text-ink/55">
                03 / The Artisans
              </span>
            </div>

            <h2
              className="
                mt-7
                max-w-[760px]
                font-display
                text-[clamp(3.2rem,7vw,7rem)]
                font-normal
                leading-[0.86]
                tracking-[-0.055em]
                text-ink
              "
            >
              Hands behind
              <br />
              the{" "}
              <span className="italic text-terracotta">
                craft.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.9,
              delay: 0.12,
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
            <p className="max-w-[350px] text-sm leading-7 text-smoke sm:text-base">
              Good grooming is built on attention. Our
              barbers bring years of technique, a sharp eye,
              and their own interpretation of the craft.
            </p>
          </motion.div>
        </div>

        {/* Artisan grid */}
        <div className="mt-20 lg:mt-28">
          <div className="grid grid-cols-12 gap-x-5 gap-y-16 lg:gap-x-8">
            {artisans.map((artisan, index) => (
              <ArtisanCard
                key={artisan.name}
                artisan={artisan}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.9,
            ease: EASE,
          }}
          className="
            mt-24
            border-t
            border-ink/15
            pt-7
            lg:mt-32
          "
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[480px] text-sm leading-6 text-smoke">
              Different hands. Different perspectives.
              One standard of precision.
            </p>

            <Link
              href="#booking"
              className="
                group
                inline-flex
                items-center
                gap-3
                self-start
                text-label
                text-ink
              "
            >
              Meet the team

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-ink/20
                  transition-all
                  duration-500
                  ease-[var(--ease-editorial)]
                  group-hover:translate-x-1
                  group-hover:border-terracotta
                  group-hover:text-terracotta
                "
              >
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ArtisanCard({
  artisan,
  index,
}: {
  artisan: (typeof artisans)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: EASE,
      }}
      className={`
        col-span-12
        sm:col-span-6
        lg:col-span-4
        ${index === 1 ? "lg:mt-20" : ""}
        ${index === 2 ? "lg:mt-8" : ""}
      `}
    >
      <div className="group">
        {/* Image */}
        <div
          className="
            image-editorial
            relative
            aspect-[3/4]
            overflow-hidden
            bg-bone
          "
        >
          <Image
            src={artisan.image}
            alt={`${artisan.name}, ${artisan.role}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="
              object-cover
              saturate-[0.62]
              contrast-[1.08]
              brightness-[0.82]
              sepia-[0.08]
              transition-transform
              duration-[1200ms]
              ease-[var(--ease-editorial)]
              group-hover:scale-[1.035]
            "
          />

          {/* Warm photographic treatment */}
          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(135deg,rgba(194,89,63,0.08),transparent_45%,rgba(20,17,15,0.2))]
              opacity-80
              transition-opacity
              duration-700
              group-hover:opacity-100
            "
          />

          {/* Number */}
          <div
            className="
              absolute
              left-5
              top-5
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-parchment/30
              bg-oak/20
              backdrop-blur-sm
            "
          >
            <span className="text-[0.62rem] font-medium tracking-[0.08em] text-parchment">
              {artisan.number}
            </span>
          </div>

          {/* Hover label */}
          <div
            className="
              absolute
              inset-x-5
              bottom-5
              flex
              items-center
              justify-between
              opacity-0
              transition-all
              duration-500
              ease-[var(--ease-editorial)]
              group-hover:opacity-100
            "
          >
            <span className="text-eyebrow text-parchment/80">
              View profile
            </span>

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-parchment
                text-ink
                transition-transform
                duration-500
                ease-[var(--ease-editorial)]
                group-hover:translate-x-1
              "
            >
              ↗
            </span>
          </div>
        </div>

        {/* Information */}
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-[1.65rem] leading-none tracking-[-0.025em] text-ink">
              {artisan.name}
            </h3>

            <p className="mt-2 text-label text-smoke">
              {artisan.role}
            </p>
          </div>

          <span className="mt-1 text-eyebrow text-ink/25">
            {artisan.number}
          </span>
        </div>
      </div>
    </motion.article>
  );
}