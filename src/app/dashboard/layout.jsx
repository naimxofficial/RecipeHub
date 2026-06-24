import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = session.user;

  if (user.isBlocked) {
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