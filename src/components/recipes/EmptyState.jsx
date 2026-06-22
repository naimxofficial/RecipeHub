import { FaBowlFood } from "react-icons/fa6";

export default function EmptyState({ category }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-surface text-muted">
                <FaBowlFood className="size-7" />
            </span>
            <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                    No recipes found
                </h3>
                <p className="mt-1.5 text-sm text-muted">
                    {category
                        ? `There are no recipes in the "${category}" category yet.`
                        : "No recipes have been added yet. Check back soon!"}
                </p>
            </div>
        </div>
    );
}