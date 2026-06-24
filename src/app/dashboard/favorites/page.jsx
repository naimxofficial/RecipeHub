import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import FavoritesClient from "@/components/dashboard/FavoritesClient";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return <div>Please log in to view your favorites.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          SAVED RECIPES
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          My Favorites
        </h1>
      </div>

      <FavoritesClient userId={user.id} userEmail={user.email} />
    </div>
  );
}