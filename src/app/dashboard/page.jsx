import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UserOverview from "@/components/dashboard/UserOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  const user = session?.user;

  if (user?.role === "admin") {
    return <AdminOverview user={user} />;
  }

  return <UserOverview user={user} />;
}