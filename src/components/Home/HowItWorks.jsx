import { FaMagnifyingGlass, FaFireBurner, FaShareNodes } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    icon: FaMagnifyingGlass,
    title: "Discover",
    description:
      "Browse thousands of recipes by category, cuisine, or what's trending with the community right now.",
  },
  {
    icon: FaFireBurner,
    title: "Cook",
    description:
      "Follow clear, step-by-step instructions, save your favorites, and make a dish your own.",
  },
  {
    icon: FaShareNodes,
    title: "Share",
    description:
      "Post your own creations, collect likes, and build a name for yourself as a home cook.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The process"
          title="How RecipeHub works"
          align="center"
          description="Three simple steps between you and your next favorite meal."
        />

        <div className="relative mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {/* Connecting line, desktop only */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-9 hidden border-t border-dashed border-separator sm:block"
          />

          {STEPS.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 flex size-18 items-center justify-center rounded-full border border-separator bg-surface text-accent">
                <step.icon className="size-7" />
              </span>
              <span className="mt-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-muted">
                Step {index + 1}
              </span>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}