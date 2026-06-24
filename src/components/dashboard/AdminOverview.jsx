import NextLink from "next/link";
import {
  FaUsers,
  FaUtensils,
  FaCrown,
  FaFlag,
  FaArrowRight,
  FaCircleUser,
  FaCircleCheck,
  FaBan,
  FaStar,
} from "react-icons/fa6";

async function getAdminStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const [statsRes, activityRes] = await Promise.all([
      fetch(`${baseUrl}/admin/stats`,           { cache: "no-store" }),
      fetch(`${baseUrl}/admin/recent-activity`, { cache: "no-store" }),
    ]);

    const stats    = statsRes.ok    ? await statsRes.json()    : {};
    const activity = activityRes.ok ? await activityRes.json() : {};

    return { stats, activity };
  } catch {
    return { stats: {}, activity: {} };
  }
}

function StatCard({ icon: Icon, label, value, color, href }) {
  const colorMap = {
    accent:  "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger:  "bg-danger/10 text-danger",
  };

  const card = (
    <div className={`flex items-center gap-4 rounded-2xl border border-separator bg-surface p-5 transition-shadow ${href ? "hover:shadow-md hover:shadow-accent/5" : ""}`}>
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-bold text-surface-foreground">{value ?? "—"}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );

  return href ? <NextLink href={href}>{card}</NextLink> : card;
}

export default async function AdminOverview({ user }) {
  const { stats, activity } = await getAdminStats();
  const { recentUsers = [], recentRecipes = [] } = activity;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          Admin Dashboard
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          Platform overview
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s what&apos;s happening on RecipeHub right now.
        </p>
      </div>

      {/* 4 stat cards — spec requires exactly these 4 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FaUsers}
          label="Total users"
          value={stats.totalUsers}
          color="accent"
          href="/dashboard/admin/users"
        />
        <StatCard
          icon={FaUtensils}
          label="Total recipes"
          value={stats.totalRecipes}
          color="success"
          href="/dashboard/admin/recipes"
        />
        <StatCard
          icon={FaCrown}
          label="Premium members"
          value={stats.totalPremium}
          color="warning"
        />
        <StatCard
          icon={FaFlag}
          label="Pending reports"
          value={stats.totalReports}
          color="danger"
          href="/dashboard/admin/reports"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-foreground">
              Recent users
            </h2>
            <NextLink
              href="/dashboard/admin/users"
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Manage <FaArrowRight className="size-3" />
            </NextLink>
          </div>

          <div className="overflow-hidden rounded-2xl border border-separator">
            {recentUsers.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">No users yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-separator bg-surface">
                    <th className="px-4 py-3 text-left font-semibold text-surface-foreground">User</th>
                    <th className="px-4 py-3 text-center font-semibold text-surface-foreground">Premium</th>
                    <th className="px-4 py-3 text-center font-semibold text-surface-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator bg-background">
                  {recentUsers.map((u) => (
                    <tr key={u._id?.toString()} className="hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-muted">
                            <FaCircleUser className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-surface-foreground">
                              {u.name}
                            </p>
                            <p className="truncate text-xs text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.isPremium ? (
                          <FaCrown className="mx-auto size-4 text-warning" />
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
                            <FaBan className="size-3" /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                            <FaCircleCheck className="size-3" /> Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent recipes */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-foreground">
              Recent recipes
            </h2>
            <NextLink
              href="/dashboard/admin/recipes"
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Manage <FaArrowRight className="size-3" />
            </NextLink>
          </div>

          <div className="overflow-hidden rounded-2xl border border-separator">
            {recentRecipes.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">No recipes yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-separator bg-surface">
                    <th className="px-4 py-3 text-left font-semibold text-surface-foreground">Recipe</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground sm:table-cell">Category</th>
                    <th className="px-4 py-3 text-center font-semibold text-surface-foreground">Featured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator bg-background">
                  {recentRecipes.map((r) => (
                    <tr key={r._id?.toString()} className="hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <NextLink
                          href={`/recipes/${r._id}`}
                          className="font-medium text-foreground hover:text-accent"
                        >
                          {r.recipeName}
                        </NextLink>
                        <p className="text-xs text-muted">{r.authorName}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted sm:table-cell">
                        {r.category}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.isFeatured ? (
                          <FaStar className="mx-auto size-4 text-warning" />
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}