"use client";

import NextLink from "next/link";
import { motion } from "motion/react";
import { FaArrowRight } from "react-icons/fa6";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATS = [
  { label: "Recipes shared", value: "2,400+" },
  { label: "Home cooks", value: "900+" },
  { label: "Cuisines covered", value: "40+" },
  { label: "Avg. rating", value: "4.8 / 5" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* Left: menu heading */}
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="flex items-center gap-3"
            >
              <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Tonight&apos;s Menu
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="h-px flex-1 origin-left bg-separator"
              />
              <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-muted">
                Serves everyone
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={0.15}
              variants={fadeUp}
              className="mt-7 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Cook something <span className="text-accent">worth sharing.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.25}
              variants={fadeUp}
              className="mt-5 max-w-lg text-balance text-base leading-relaxed text-muted sm:text-lg"
            >
              Discover recipes from real home cooks, save the ones
              you&apos;ll actually make again, and share your own with a
              community that shows up to the table.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.35}
              variants={fadeUp}
              className="mt-10 max-w-md"
            >
              <NextLink
                href="/recipes"
                className="group flex items-center gap-3 border-b border-separator pb-3 text-foreground transition-colors hover:border-accent"
              >
                <span className="font-display text-base font-semibold tracking-tight">
                  Browse Recipes
                </span>
                <span className="h-px flex-1 border-b border-dotted border-separator" />
                <FaArrowRight className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
              </NextLink>

              <NextLink
                href="/dashboard/add-recipe"
                className="mt-3 inline-block text-sm italic text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                *or add yours to the menu
              </NextLink>
            </motion.div>
          </div>

          {/* Right: pinned index card */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeIn}
            className="relative mx-auto w-full max-w-xs lg:mx-0 lg:ml-auto"
          >
            <div className="rotate-2 rounded-sm border border-separator bg-surface p-6 shadow-lg shadow-foreground/5 transition-transform duration-300 hover:rotate-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-accent">
                RecipeHub · At a glance
              </p>

              <dl className="mt-5 space-y-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-2">
                    <dt className="whitespace-nowrap text-sm text-muted">
                      {stat.label}
                    </dt>
                    <span className="h-px flex-1 border-b border-dotted border-separator" />
                    <dd className="whitespace-nowrap font-display text-sm font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 border-t border-dashed border-separator pt-4 text-[0.7rem] leading-relaxed text-muted">
                * fresh recipes added weekly, no reservations required.
              </p>
            </div>

            {/* "Pin" accent, purely decorative */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}