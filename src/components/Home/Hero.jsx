"use client";

import NextLink from "next/link";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { FaArrowRight, FaStar } from "react-icons/fa6";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Ambient glow, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] size-112 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[-10%] size-72 rounded-full bg-success/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <motion.span
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-separator bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent"
        >
          <FaStar className="size-3.5" />
          Recipe sharing, done right
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Cook something <span className="text-accent">worth sharing.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg"
        >
          Discover recipes from real home cooks, save the ones you&apos;ll
          actually make again, and share your own with a community that
          shows up to the table.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.3}
          variants={fadeUp}
          className="mt-9 flex flex-col items-center gap-3"
        >
          <Button
            variant="primary"
            size="lg"
            render={(domProps) => <NextLink {...domProps} href="/recipes" />}
            className="group"
          >
            Browse Recipes
            <FaArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <NextLink
            href="/dashboard/add-recipe"
            className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            or share your own recipe →
          </NextLink>
        </motion.div>
      </div>
    </section>
  );
}