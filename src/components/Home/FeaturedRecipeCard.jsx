import Image from "next/image";
import NextLink from "next/link";
import { FaClock, FaStar } from "react-icons/fa6";

export default function FeaturedRecipeCard({ recipe }) {
  return (
    <NextLink
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface transition-shadow hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={400}
          height={300}
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-warning px-2.5 py-1 text-xs font-semibold text-warning-foreground">
          <FaStar className="size-3" />
          Featured
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold text-surface-foreground">
          {recipe.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-background px-2.5 py-1">{recipe.category}</span>
          <span className="rounded-full bg-background px-2.5 py-1">{recipe.cuisine}</span>
        </div>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
          <FaClock className="size-3.5" />
          {recipe.prepTime}
        </div>
      </div>
    </NextLink>
  );
}