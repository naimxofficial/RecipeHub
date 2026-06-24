import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

async function getFullUser(sessionUser) {
  if (!sessionUser) return null;
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("recipehub");
    const user = await db
      .collection("user")
      .findOne(
        { id: sessionUser.id },
        { projection: { role: 1, isPremium: 1, isBlocked: 1, name: 1, email: 1, image: 1 } }
      );
    await client.close();
    return user
      ? {
          ...sessionUser,
          role: user.role ?? "user",
          isPremium: user.isPremium ?? false,
          isBlocked: user.isBlocked ?? false,
        }
      : sessionUser;
  } catch {
    // Fall back to session data if DB call fails
    return sessionUser;
  }
}

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = await getFullUser(session.user);

  if (user?.isBlocked) {
    redirect("/blocked");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background lg:flex-row">
      <DashboardSidebar user={user} />

      {/* Page content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}