import NextLink from "next/link";
import {
  FaEgg,
  FaBreadSlice,
  FaDrumstickBite,
  FaCakeCandles,
  FaBowlFood,
  FaGlassWater,
  FaCarrot,
  FaLeaf,
} from "react-icons/fa6";
import SectionHeading from "./SectionHeading";

const CATEGORIES = [
  { label: "Breakfast", icon: FaEgg },
  { label: "Lunch", icon: FaBreadSlice },
  { label: "Dinner", icon: FaDrumstickBite },
  { label: "Dessert", icon: FaCakeCandles },
  { label: "Appetizer", icon: FaBowlFood },
  { label: "Beverage", icon: FaGlassWater },
  { label: "Salad", icon: FaCarrot },
  { label: "Vegan", icon: FaLeaf },
];

export default function BrowseByCategory() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Find your craving"
          title="Browse by category"
          description="Jump straight to the kind of dish you're in the mood for."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <NextLink
              key={label}
              href={`/recipes?category=${encodeURIComponent(label)}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-separator bg-background px-4 py-7 text-center transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-surface text-accent transition-transform group-hover:scale-110">
                <Icon className="size-6" />
              </span>
              <span className="text-sm font-semibold text-surface-foreground">
                {label}
              </span>
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
}