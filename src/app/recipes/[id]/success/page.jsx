'use client';

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NextLink from "next/link";
import { FaCrown, FaCircleCheck } from "react-icons/fa6";

export default function RecipePurchaseSuccess() {
    const searchParams = useSearchParams();
    const params = useParams();           // ← Correct way
    const router = useRouter();

    const sessionId = searchParams.get("session_id");
    const recipeId = params.id;           // ← Now safe

    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verifyPurchase = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/payments/verify-recipe?session_id=${sessionId}`
                );

                const data = await res.json();

                if (res.ok) {
                    toast.success("Recipe purchased successfully! 🎉");
                    setStatus("success");
                    router.refresh();        // Refresh to update purchased state
                } else {
                    setStatus("error");
                    toast.error(data.error || "Verification failed");
                }
            } catch (err) {
                console.error(err);
                setStatus("error");
                toast.error("Failed to verify purchase");
            }
        };

        verifyPurchase();
    }, [sessionId, router]);

    // Verifying State
    if (status === "verifying") {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
                <div className="size-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                <h2 className="text-xl font-semibold">Confirming your purchase...</h2>
                <p className="text-sm text-muted">Please wait a moment</p>
            </div>
        );
    }

    // Error State
    if (status === "error") {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center px-4">
                <FaCrown className="size-16 text-warning" />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
                    <p className="mt-2 text-muted">We couldn&apos;t confirm your payment.</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <NextLink
                        href={`/recipes/${recipeId || ""}`}
                        className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
                    >
                        Back to Recipe
                    </NextLink>
                    <NextLink
                        href="/dashboard/purchased"
                        className="rounded-xl border border-separator px-6 py-3 text-sm font-medium"
                    >
                        My Purchases
                    </NextLink>
                </div>
            </div>
        );
    }

    // Success State
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center px-4">
            <div className="relative">
                <div className="flex size-28 items-center justify-center rounded-full bg-success/10">
                    <FaCircleCheck className="size-16 text-success" />
                </div>
                <div className="absolute -bottom-2 -right-2 flex size-12 items-center justify-center rounded-full bg-accent text-white shadow-lg">
                    <FaCrown className="size-6" />
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                    Purchase Successful!
                </h1>
                <p className="mt-3 text-lg text-muted">
                    You now own this recipe
                </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <NextLink
                    href={`/recipes/${recipeId}`}
                    className="rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                    View Full Recipe
                </NextLink>

                <NextLink
                    href="/dashboard/purchased"
                    className="rounded-xl border border-separator px-8 py-3.5 text-sm font-medium hover:bg-surface transition-colors"
                >
                    See All My Purchases
                </NextLink>
            </div>
        </div>
    );
}