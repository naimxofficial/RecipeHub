import { MongoClient } from "mongodb";
import NextLink from "next/link";
import {
  FaBookBookmark,
  FaHeart,
  FaFireFlameCurved,
  FaCrown,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa6";

const DIFFICULTY_COLORS = {
  Easy:   "text-success bg-success/10",
  Medium: "text-warning bg-warning/10",
  Hard:   "text-danger bg-danger/10",
};

async function getUserStats(userId) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("recipehub");

    const [totalRecipes, totalFavorites, likesData, recentRecipes] =
      await Promise.all([
        db.collection("recipes").countDocuments({ authorId: userId }),
        db.collection("favorites").countDocuments({ userId }),
        db.collection("recipes")
          .aggregate([
            { $match: { authorId: userId } },
            { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
          ])
          .toArray(),
        db.collection("recipes")
          .find({ authorId: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),
      ]);

    await client.close();
    return {
      totalRecipes,
      totalFavorites,
      totalLikesReceived: likesData[0]?.totalLikes ?? 0,
      recentRecipes,
    };
  } catch {
    return { totalRecipes: 0, totalFavorites: 0, totalLikesReceived: 0, recentRecipes: [] };
  }
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    accent:  "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-separator bg-surface p-5">
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-bold text-surface-foreground">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export default async function UserOverview({ user }) {
  const { totalRecipes, totalFavorites, totalLikesReceived, recentRecipes } =
    await getUserStats(user.id);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            Dashboard
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0] ?? "Chef"} 👋
          </h1>
        </div>
        {user?.isPremium ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-warning/10 px-4 py-2 text-sm font-semibold text-warning">
            <FaCrown className="size-4" /> Premium member
          </span>
        ) : (
          <NextLink href="/dashboard/premium"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-warning/60 px-4 py-2 text-sm font-medium text-warning/80 hover:bg-warning/10">
            <FaCrown className="size-4" /> Upgrade to Premium
          </NextLink>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FaBookBookmark} label="Total recipes posted"  value={totalRecipes}        color="accent"  />
        <StatCard icon={FaHeart}        label="Total favorites saved"  value={totalFavorites}      color="success" />
        <StatCard icon={FaFireFlameCurved} label="Total likes received" value={totalLikesReceived} color="warning" />
      </div>

      {/* Recipe limit notice */}
      {!user?.isPremium && (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-warning/50 bg-warning/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-surface-foreground">
              Free plan: {totalRecipes}/2 recipes used
            </p>
            <p className="mt-0.5 text-xs text-muted">Upgrade to Premium to post unlimited recipes.</p>
          </div>
          <NextLink href="/dashboard/premium"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-warning px-4 py-2 text-sm font-semibold text-warning-foreground hover:opacity-90">
            <FaCrown className="size-3.5" /> Upgrade now
          </NextLink>
        </div>
      )}

      {/* Recent recipes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">Recent recipes</h2>
          <NextLink href="/dashboard/my-recipes"
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            View all <FaArrowRight className="size-3" />
          </NextLink>
        </div>

        {recentRecipes.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-separator py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface text-muted">
              <FaBookBookmark className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">No recipes yet</p>
              <p className="mt-1 text-xs text-muted">Share your first recipe with the community.</p>
            </div>
            <NextLink href="/dashboard/add-recipe"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90">
              <FaPlus className="size-3.5" /> Add your first recipe
            </NextLink>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-separator">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-separator bg-surface">
                  <th className="px-4 py-3 text-left font-semibold text-surface-foreground">Recipe</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground sm:table-cell">Category</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-surface-foreground md:table-cell">Difficulty</th>
                  <th className="px-4 py-3 text-right font-semibold text-surface-foreground">Likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator bg-background">
                {recentRecipes.map((recipe) => (
                  <tr key={recipe._id.toString()} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <NextLink href={`/recipes/${recipe._id}`}
                        className="font-medium text-foreground hover:text-accent">
                        {recipe.recipeName}
                      </NextLink>
                    </td>
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">{recipe.category}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_COLORS[recipe.difficultyLevel] ?? "text-muted bg-surface"}`}>
                        {recipe.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1.5 text-muted">
                        <FaHeart className="size-3 text-accent" />
                        {recipe.likesCount ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}