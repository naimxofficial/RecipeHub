import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import MyRecipesClient from "@/components/dashboard/MyRecipesClient";
import Link from "next/link";

export default async function MyRecipesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return <div>Please log in to view your recipes.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            MY RECIPES
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            My Recipes
          </h1>
        </div>

        <Link
          href="/dashboard/add-recipe"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors my-3"
        >
          <span>+</span> Add New Recipe
        </Link>
      </div>

      <MyRecipesClient userId={user.id} userEmail={user.email} />
    </div>
  );
}