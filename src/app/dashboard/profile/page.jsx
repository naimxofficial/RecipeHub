import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ProfileClient from "@/components/dashboard/ProfileClient";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          ACCOUNT
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          My Profile
        </h1>
      </div>

      <ProfileClient 
        userId={user.id} 
        initialUser={{
          name: user.name,
          email: user.email,
          image: user.image,
        }} 
      />
    </div>
  );
}