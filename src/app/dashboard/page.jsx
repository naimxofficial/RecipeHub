import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";
import UserOverview from "@/components/dashboard/UserOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

async function getFullUser(sessionUser) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("recipehub");
    const user = await db
      .collection("user")
      .findOne(
        { id: sessionUser.id },
        { projection: { role: 1, isPremium: 1 } }
      );
    await client.close();
    return {
      ...sessionUser,
      role: user?.role ?? "user",
      isPremium: user?.isPremium ?? false,
    };
  } catch {
    return { ...sessionUser, role: "user", isPremium: false };
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await getFullUser(session.user);

  if (user.role === "admin") {
    return <AdminOverview user={user} />;
  }

  return <UserOverview user={user} />;
}