import { Suspense } from "react";
import CategoryFilter from "@/components/recipes/CategoryFilter";
import RecipeCard from "@/components/recipes/RecipeCard";
import Pagination from "@/components/recipes/Pagination";
import EmptyState from "@/components/recipes/EmptyState";

export const metadata = {
  title: "Browse Recipes — RecipeHub",
  description: "Discover recipes shared by our community.",
};

async function getRecipes({ page, category }) {
  try {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", "9");
    if (category) params.set("category", category);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/recipes?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return { recipes: [], totalCount: 0, page: 1, totalPages: 0 };
  }
}

export default async function Recipes({ searchParams }) {
  const resolvedSearchParams = await searchParams;

    const page = Math.max(1, parseInt(resolvedSearchParams?.page) || 1);
    const category = resolvedSearchParams?.category || "";

  const { recipes, totalCount, totalPages } = await getRecipes({
    page,
    category,
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            Community recipes
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse all recipes
          </h1>
          <p className="mt-2 text-sm text-muted">
            {totalCount > 0
              ? `${totalCount} recipe${totalCount === 1 ? "" : "s"} found${category ? ` in "${category}"` : ""}`
              : "Discover dishes from our community"}
          </p>
        </div>

        {/* Category filter — needs Suspense because it uses useSearchParams */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-full bg-surface" />}>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* Recipe grid or empty state */}
        {recipes.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Suspense fallback={null}>
                  <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                  />
                </Suspense>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}