import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ManageRecipesClient from "@/components/dashboard/admin/ManageRecipesClient";

export default async function ManageRecipesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || user.role !== "admin") {
    return <div>Access Denied. Admin only.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          ADMIN PANEL
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          Manage Recipes
        </h1>
      </div>

      <ManageRecipesClient adminId={user.id} />
    </div>
  );
}