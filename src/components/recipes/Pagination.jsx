"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Pagination({ totalPages, currentPage }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const goTo = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page);
        router.push(`/recipes?${params.toString()}`);
    };

    // Build page number array with ellipsis logic
    const getPages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages = [];
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, "…", totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5">
            {/* Prev */}
            <button
                type="button"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex size-9 items-center justify-center rounded-full border border-separator bg-surface text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:pointer-events-none disabled:opacity-40"
            >
                <FaChevronLeft className="size-3" />
            </button>

            {/* Page numbers */}
            {getPages().map((page, index) =>
                page === "…" ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="flex size-9 items-center justify-center text-sm text-muted"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        onClick={() => goTo(page)}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex size-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${page === currentPage
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-separator bg-surface text-surface-foreground hover:border-accent/50 hover:text-accent"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                type="button"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex size-9 items-center justify-center rounded-full border border-separator bg-surface text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:pointer-events-none disabled:opacity-40"
            >
                <FaChevronRight className="size-3" />
            </button>
        </div>
    );
}