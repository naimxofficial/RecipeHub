import SectionHeading from "./SectionHeading";
import PopularRecipeCard from "./PopularRecipeCard";

// Temporary placeholder data — swap once GET {NEXT_PUBLIC_URL}/recipes/popular
// is live (recipes sorted by likesCount, descending).
const MOCK_POPULAR_RECIPES = [
  { _id: "mock-5", recipeName: "Triple Basil Pesto Gnocchi", authorName: "Mira Haldar", likesCount: 482, recipeImage: "https://picsum.photos/seed/popular-1/200/200" },
  { _id: "mock-6", recipeName: "Crispy Turmeric Cauliflower", authorName: "Omar Reyes", likesCount: 397, recipeImage: "https://picsum.photos/seed/popular-2/200/200" },
  { _id: "mock-7", recipeName: "Slow Roasted Paprika Pork", authorName: "Lena Wolfe", likesCount: 356, recipeImage: "https://picsum.photos/seed/popular-3/200/200" },
  { _id: "mock-8", recipeName: "Saffron Lemon Risotto", authorName: "Priya Nair", likesCount: 318, recipeImage: "https://picsum.photos/seed/popular-4/200/200" },
  { _id: "mock-9", recipeName: "Charcoal Grilled Veg Skewers", authorName: "Theo Marsh", likesCount: 271, recipeImage: "https://picsum.photos/seed/popular-5/200/200" },
  { _id: "mock-10", recipeName: "Brown Sugar Banana Bread", authorName: "Aiko Tanaka", likesCount: 249, recipeImage: "https://picsum.photos/seed/popular-6/200/200" },
];

// async function getPopularRecipes() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/recipes/popular`, {
//       next: { revalidate: 300 },
//     });
//     if (!res.ok) throw new Error("Failed to fetch popular recipes");
//     const data = await res.json();
//     return Array.isArray(data) && data.length > 0 ? data : MOCK_POPULAR_RECIPES;
//   } catch {
//     return MOCK_POPULAR_RECIPES;
//   }
// }

export default async function PopularRecipes({recipes = []}) {
  // const recipes = await getPopularRecipes();
  const displayRecipes = recipes.length > 0 ? recipes : MOCK_POPULAR_RECIPES;

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trending now"
          title="Most-loved recipes"
          description="Ranked by likes from the community — the dishes people keep coming back to."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayRecipes.map((recipe, index) => (
            <PopularRecipeCard key={recipe._id} recipe={recipe} rank={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}