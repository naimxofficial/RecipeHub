import Hero from "@/components/Home/Hero";
import FeaturedRecipes from "@/components/Home/FeaturedRecipes";
import PopularRecipes from "@/components/Home/PopularRecipes";
import HowItWorks from "@/components/Home/HowItWorks";
import BrowseByCategory from "@/components/Home/BrowseByCategory";
import CommunitySection from "@/components/Home/CommunitySection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import BenefitsSection from "@/components/Home/BenefitsSection";

async function getFeaturedRecipes() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/recipes/featured`, {
            next: { revalidate: 30 },
            cache: 'force-cache',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : [];
    } catch {
        return [];
    }
}

async function getPopularRecipes() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/recipes/popular`, {
            next: { revalidate: 30 },
            cache: 'force-cache',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : [];
    } catch {
        return [];
    }
}

export default async function Home() {
    const [featuredRecipes, popularRecipes] = await Promise.all([
        getFeaturedRecipes(),
        getPopularRecipes()
    ]);

    return (
        <div>
            <Hero />
            <FeaturedRecipes recipes={featuredRecipes} />
            <PopularRecipes recipes={popularRecipes} />
            <HowItWorks />
            <BenefitsSection />
            <BrowseByCategory />
            <TestimonialsSection />
            <CommunitySection />
        </div>
    );
}