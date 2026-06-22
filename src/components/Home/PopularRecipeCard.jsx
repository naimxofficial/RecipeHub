import Image from "next/image";
import NextLink from "next/link";
import { FaHeart, FaCircleUser } from "react-icons/fa6";

export default function PopularRecipeCard({ recipe, rank }) {
  return (
    <NextLink
      href={`/recipes/${recipe._id}`}
      className="group flex items-center gap-4 rounded-2xl border border-separator bg-background p-3 transition-shadow hover:shadow-lg hover:shadow-accent/5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface font-display text-sm font-bold text-accent">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="size-16 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={recipe.recipeImage}
          alt={recipe.recipeName}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={64}
          height={64}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-sm font-semibold text-foreground">
          {recipe.recipeName}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <FaCircleUser className="size-3.5" />
          {recipe.authorName}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent">
        <FaHeart className="size-4" />
        {recipe.likesCount}
      </div>
    </NextLink>
  );
}