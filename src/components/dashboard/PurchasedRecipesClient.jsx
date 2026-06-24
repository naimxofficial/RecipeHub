"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NextLink from "next/link";
import { Calendar, Receipt } from "lucide-react";
import Image from "next/image";
import { Spinner } from "@heroui/react";

export default function PurchasedRecipesClient({ userId, userEmail }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchased = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/purchased?userId=${userId}&userEmail=${encodeURIComponent(userEmail)}`
      );

      if (!res.ok) throw new Error();
      const data = await res.json();
      setPurchases(data.purchases || []);
    } catch (err) {
      toast.error("Failed to load purchased recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchased();
  }, [userId]);

  if (loading) return (<div className="flex flex-col items-center gap-2 text-center py-12 text-sm text-muted">Loading your purchases...
          <Spinner color='accent' size="xl" />
      </div>);

  if (purchases.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-separator py-20 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-surface">
          <Receipt className="size-10 text-muted" />
        </div>
        <h3 className="mt-6 text-xl font-semibold">No purchases yet</h3>
        <p className="mt-2 text-muted max-w-sm mx-auto">
          You haven&apos;t purchased any recipes yet. Browse and buy amazing recipes from our community.
        </p>
        <NextLink
          href="/recipes"
          className="mt-8 inline-block rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground"
        >
          Browse Recipes
        </NextLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchases.map((recipe) => (
        <div
          key={recipe._id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface hover:shadow-lg transition-all"
        >
          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              width={400}
              height={300}
              src={recipe.recipeImage}
              alt={recipe.recipeName}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Purchased
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2">
              {recipe.recipeName}
            </h3>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
              <span>{recipe.category}</span>
              <span>•</span>
              <span>{recipe.preparationTime}</span>
            </div>

            {recipe.purchasedAt && (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <Calendar className="size-3.5" />
                Purchased on {new Date(recipe.purchasedAt).toLocaleDateString()}
              </div>
            )}

            <div className="mt-auto pt-6">
              <NextLink
                href={`/recipes/${recipe._id}`}
                className="block w-full text-center py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                View Full Recipe
              </NextLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}