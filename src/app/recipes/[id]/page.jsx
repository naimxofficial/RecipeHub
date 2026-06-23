import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import RecipeActions from "@/components/recipes/RecipeActions";
import {
    FaClock,
    FaFire,
    FaUtensils,
    FaCircleUser,
    FaListCheck,
    FaBookOpen,
    FaStar,
} from "react-icons/fa6";
import Image from "next/image";

const DIFFICULTY_COLORS = {
    Easy: "text-success bg-success/10",
    Medium: "text-warning bg-warning/10",
    Hard: "text-danger bg-danger/10",
};

async function getRecipeDetails(id, userId) {
    const baseUrl = process.env.NEXT_PUBLIC_URL;

    const fetches = [
        fetch(`${baseUrl}/recipes/${id}`, { cache: "no-store" }),
        userId
            ? fetch(`${baseUrl}/recipes/${id}/like-status?userId=${userId}`, {
                cache: "no-store",
            })
            : Promise.resolve(null),
        userId
            ? fetch(`${baseUrl}/recipes/${id}/favorite-status?userId=${userId}`, {
                cache: "no-store",
            })
            : Promise.resolve(null),
    ];

    const [recipeRes, likeRes, favRes] = await Promise.all(fetches);

    if (!recipeRes.ok) return null;

    const [recipe, likeData, favData] = await Promise.all([
        recipeRes.json(),
        likeRes ? likeRes.json() : { liked: false, likesCount: 0 },
        favRes ? favRes.json() : { favorited: false },
    ]);

    return {
        recipe,
        liked: likeData.liked ?? false,
        likesCount: likeData.likesCount ?? recipe.likesCount ?? 0,
        favorited: favData.favorited ?? false,
    };
}


export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/recipes/${id}`,
            { cache: "no-store" }
        );
        if (!res.ok) return { title: "Recipe — RecipeHub" };
        const recipe = await res.json();
        return {
            title: `${recipe.recipeName} — RecipeHub`,
            description: `${recipe.cuisineType} ${recipe.category} recipe by ${recipe.authorName}`,
        };
    } catch {
        return { title: "Recipe — RecipeHub" };
    }
}


export default async function RecipeDetailsPage({ params }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user ?? null;

    const data = await getRecipeDetails(id, user?.id);
    if (!data) notFound();

    const { recipe, liked, likesCount, favorited } = data;
    const difficulty = DIFFICULTY_COLORS[recipe.difficultyLevel] || "text-muted bg-surface";

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Hero image */}
                <div className="overflow-hidden rounded-2xl">
                    <Image
                        width={1600}
                        height={700}
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        className="aspect-16/7 w-full object-cover"
                    />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Left — main content */}
                    <div className="lg:col-span-2">
                        {/* Title + badges */}
                        <div className="flex flex-wrap items-start gap-3">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-surface-foreground">
                                    {recipe.category}
                                </span>
                                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${difficulty}`}>
                                    <FaFire className="size-3" />
                                    {recipe.difficultyLevel}
                                </span>
                                {recipe.isFeatured && (
                                    <span className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                                        <FaStar className="size-3" />
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>

                        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {recipe.recipeName}
                        </h1>

                        {/* Meta */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                            <span className="flex items-center gap-1.5">
                                <FaUtensils className="size-3.5 text-accent" />
                                {recipe.cuisineType}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FaClock className="size-3.5 text-accent" />
                                {recipe.preparationTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FaCircleUser className="size-3.5 text-accent" />
                                {recipe.authorName}
                            </span>
                        </div>

                        {/* Action bar (like, favorite, report, purchase) */}
                        <div className="mt-6 rounded-2xl border border-separator bg-surface p-4">
                            <RecipeActions
                                recipe={recipe}
                                user={user}
                                initialLiked={liked}
                                initialFavorited={favorited}
                                initialLikesCount={likesCount}
                            />
                        </div>

                        {/* Ingredients */}
                        <section className="mt-10">
                            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-foreground">
                                <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <FaListCheck className="size-4" />
                                </span>
                                Ingredients
                            </h2>
                            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {recipe.ingredients?.map((ingredient, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 rounded-xl border border-separator bg-surface px-4 py-2.5 text-sm text-surface-foreground"
                                    >
                                        <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Instructions */}
                        <section className="mt-10">
                            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-foreground">
                                <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <FaBookOpen className="size-4" />
                                </span>
                                Instructions
                            </h2>
                            <ol className="mt-4 flex flex-col gap-4">
                                {recipe.instructions?.map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-accent-foreground">
                                            {i + 1}
                                        </span>
                                        <p className="pt-0.5 text-sm leading-relaxed text-surface-foreground">
                                            {step}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </div>

                    {/* Right — sidebar summary */}
                    <aside className="flex flex-col gap-4 lg:pt-2">
                        <div className="rounded-2xl border border-separator bg-surface p-5">
                            <h3 className="font-display text-sm font-semibold text-surface-foreground">
                                Recipe summary
                            </h3>
                            <ul className="mt-4 flex flex-col gap-3 text-sm">
                                <SummaryRow label="Category" value={recipe.category} />
                                <SummaryRow label="Cuisine" value={recipe.cuisineType} />
                                <SummaryRow label="Difficulty" value={recipe.difficultyLevel} />
                                <SummaryRow label="Prep Time" value={recipe.preparationTime} />
                                <SummaryRow
                                    label="Ingredients"
                                    value={`${recipe.ingredients?.length ?? 0} items`}
                                />
                                <SummaryRow
                                    label="Steps"
                                    value={`${recipe.instructions?.length ?? 0} steps`}
                                />
                                <SummaryRow
                                    label="Price"
                                    value={`$${recipe.price?.toFixed(2) ?? "—"}`}
                                />
                            </ul>
                        </div>

                        {/* Author card */}
                        <div className="rounded-2xl border border-separator bg-surface p-5">
                            <h3 className="font-display text-sm font-semibold text-surface-foreground">
                                Recipe by
                            </h3>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <FaCircleUser className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-surface-foreground">
                                        {recipe.authorName}
                                    </p>
                                    <p className="text-xs text-muted">{recipe.authorEmail}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

function SummaryRow({ label, value }) {
    return (
        <li className="flex items-center justify-between gap-2 border-b border-separator pb-3 last:border-0 last:pb-0">
            <span className="text-muted">{label}</span>
            <span className="font-medium text-surface-foreground">{value}</span>
        </li>
    );
}