import NextLink from "next/link";
import { Button } from "@heroui/react";
import {
    FaClock,
    FaFire,
    FaUtensils,
    FaCircleUser,
} from "react-icons/fa6";
import Image from "next/image";

const DIFFICULTY_COLORS = {
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-danger bg-danger/10",
};

export default function RecipeCard({ recipe }) {
    const difficulty = DIFFICULTY_COLORS[recipe.difficultyLevel] || "text-muted bg-surface";

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface transition-shadow hover:shadow-lg hover:shadow-accent/5">
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden">
                <Image
                    width={400}
                    height={300}
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Category badge */}
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                    {recipe.category}
                </span>
                {/* Difficulty badge */}
                <span className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${difficulty}`}>
                    <FaFire className="size-3" />
                    {recipe.difficultyLevel}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="font-display text-base font-semibold leading-snug text-surface-foreground">
                    {recipe.recipeName}
                </h3>

                {/* Meta row */}
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                        <FaUtensils className="size-3 text-accent" />
                        {recipe.cuisineType}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FaClock className="size-3 text-accent" />
                        {recipe.preparationTime}
                    </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-1.5 text-xs text-muted">
                    <FaCircleUser className="size-3.5 shrink-0" />
                    <span className="truncate">{recipe.authorName}</span>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-1">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                    >
                        <NextLink href={`/recipes/${recipe._id}`}>
                            View Details
                        </NextLink>
                    </Button>
                </div>
            </div>
        </div>
    );
}