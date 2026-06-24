import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import PurchasedRecipesClient from "@/components/dashboard/PurchasedRecipesClient";

export default async function PurchasedRecipesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return <div>Please log in to view your purchased recipes.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          PURCHASED RECIPES
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          My Purchased Recipes
        </h1>
        <p className="text-muted mt-2">
          Recipes you have bought and can access anytime
        </p>
      </div>

      <PurchasedRecipesClient userId={user.id} userEmail={user.email} />
    </div>
  );
}