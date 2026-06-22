"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    FaEgg,
    FaBreadSlice,
    FaDrumstickBite,
    FaCakeCandles,
    FaBowlFood,
    FaGlassWater,
    FaCarrot,
    FaLeaf,
    FaBorderAll,
} from "react-icons/fa6";

const CATEGORIES = [
    { label: "All", icon: FaBorderAll },
    { label: "Breakfast", icon: FaEgg },
    { label: "Lunch", icon: FaBreadSlice },
    { label: "Dinner", icon: FaDrumstickBite },
    { label: "Dessert", icon: FaCakeCandles },
    { label: "Appetizer", icon: FaBowlFood },
    { label: "Beverage", icon: FaGlassWater },
    { label: "Salad", icon: FaCarrot },
    { label: "Vegan", icon: FaLeaf },
];

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const current = searchParams.get("category") || "";

    const handleSelect = (label) => {
        const params = new URLSearchParams(searchParams.toString());
        if (label === "All") {
            params.delete("category");
        } else {
            params.set("category", label);
        }
        // Reset to page 1 on filter change
        params.delete("page");
        router.push(`/recipes?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, icon: Icon }) => {
                const isActive =
                    label === "All" ? !current : current === label;

                return (
                    <button
                        key={label}
                        type="button"
                        onClick={() => handleSelect(label)}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-separator bg-surface text-surface-foreground hover:border-accent/50 hover:text-accent"
                            }`}
                    >
                        <Icon className="size-3.5" />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}