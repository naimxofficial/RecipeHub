import SectionHeading from "./SectionHeading";
import FeaturedRecipesGrid from "./FeaturedRecipesGrid";


// Swap once GET {NEXT_PUBLIC_URL}/recipes/featured is live and returns
// recipes where isFeatured === true.
const MOCK_FEATURED_RECIPES = [
  {
    id: "mock-1",
    name: "Brown Butter Garlic Pasta",
    category: "Dinner",
    cuisine: "Italian",
    prepTime: "25 mins",
    image: "https://picsum.photos/seed/featured-1/600/450",
  },
  {
    id: "mock-2",
    name: "Smoky Paprika Roast Chicken",
    category: "Dinner",
    cuisine: "Spanish",
    prepTime: "55 mins",
    image: "https://picsum.photos/seed/featured-2/600/450",
  },
  {
    id: "mock-3",
    name: "Saffron Coconut Rice",
    category: "Side Dish",
    cuisine: "South Asian",
    prepTime: "30 mins",
    image: "https://picsum.photos/seed/featured-3/600/450",
  },
  {
    id: "mock-4",
    name: "Charred Lemon Basil Salad",
    category: "Salad",
    cuisine: "Mediterranean",
    prepTime: "15 mins",
    image: "https://picsum.photos/seed/featured-4/600/450",
  },
];

// async function getFeaturedRecipes() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/recipes/featured`, {
//       next: { revalidate: 300 },
//     });
//     if (!res.ok) throw new Error("Failed to fetch featured recipes");
//     const data = await res.json();
//     return Array.isArray(data) && data.length > 0 ? data : MOCK_FEATURED_RECIPES;
//   } catch {
//     return MOCK_FEATURED_RECIPES;
//   }
// }

export default async function FeaturedRecipes({ recipes = []}) {
  // const recipes = await getFeaturedRecipes();
  const displayRecipes = recipes.length > 0 ? recipes : MOCK_FEATURED_RECIPES;

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Featured recipes"
          description="A rotating shelf of dishes our admins think you should try this week."
        />
        <div className="mt-10">
          <FeaturedRecipesGrid recipes={displayRecipes} />
        </div>
      </div>
    </section>
  );
}