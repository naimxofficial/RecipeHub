"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Heart, Trash2 } from "lucide-react";
import { Button, Modal, Spinner } from "@heroui/react";
import NextLink from "next/link";
import Image from "next/image";

export default function FavoritesClient({ userId, userEmail }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal controlled states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recipeToRemove, setRecipeToRemove] = useState(null);


    useEffect(() => {
        const fetchFavorites = async () => {
            if (!userId || !userEmail) return;
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/favorites?userId=${userId}&userEmail=${encodeURIComponent(userEmail)}`
                );

                if (!res.ok) throw new Error();
                const data = await res.json();
                setFavorites(data.favorites || []);
            } catch (err) {
                toast.error("Failed to load favorites");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId, userEmail]);

    // Step 1: Open the modal and save the target recipe ID
    const triggerRemoveFavorite = (recipeId) => {
        setRecipeToRemove(recipeId);
        setIsDeleteModalOpen(true);
    };

    // Step 2: Fire the actual API call on modal approval
    const handleConfirmRemove = async () => {
        if (!recipeToRemove) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/favorites/${recipeToRemove}?userId=${userId}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                toast.success("Removed from favorites");
                setFavorites((prev) => prev.filter((r) => r._id !== recipeToRemove));
            } else {
                toast.error("Failed to remove");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            // Always clear states and close modal cleanly
            setIsDeleteModalOpen(false);
            setRecipeToRemove(null);
        }
    };

    if (loading) return (<div className="flex flex-col items-center gap-2 text-center py-12 text-sm text-muted">Loading your favorites...
        <Spinner color='accent' size="xl" />
    </div>);

    if (favorites.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-separator py-20 text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-surface">
                    <Heart className="size-10 text-muted" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No favorites yet</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">
                    Start exploring recipes and save your favorites here.
                </p>
                <NextLink
                    href="/recipes"
                    className="mt-8 inline-block rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground"
                >
                    Browse Recipes
                </NextLink>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                    <div
                        key={recipe._id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface hover:shadow-lg transition-all"
                    >
                        <div className="relative aspect-4/3 overflow-hidden">
                            <Image
                                width={400}
                                height={300}
                                src={recipe.recipeImage}
                                alt={recipe.recipeName}
                                className="size-full object-cover transition-transform group-hover:scale-105"
                            />
                            <button
                                onClick={() => triggerRemoveFavorite(recipe._id)}
                                className="absolute top-3 right-3 rounded-full bg-background/80 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-sm"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                            <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2">
                                {recipe.recipeName}
                            </h3>

                            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                                <span>{recipe.category}</span>
                                <span>•</span>
                                <span>{recipe.preparationTime}</span>
                            </div>

                            <div className="mt-auto pt-6 flex gap-3">
                                <NextLink
                                    href={`/recipes/${recipe._id}`}
                                    className="flex-1 text-center py-3 rounded-xl border border-separator hover:bg-surface font-medium text-sm transition-colors"
                                >
                                    View Recipe
                                </NextLink>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FIXED: Modern HeroUI Compound Confirmation Modal Layout */}
            <Modal>
                <Modal.Backdrop
                    isOpen={isDeleteModalOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsDeleteModalOpen(false);
                            setRecipeToRemove(null);
                        }
                    }}
                    className="bg-black/40 backdrop-blur-sm"
                >
                    <Modal.Container>
                        <Modal.Dialog className="bg-surface text-foreground rounded-2xl max-w-md p-6 border border-separator shadow-xl relative">
                            <Modal.Header>
                                <Modal.Heading className="text-lg font-bold">
                                    Remove Favorite
                                </Modal.Heading>
                            </Modal.Header>

                            <Modal.Body className="mt-2">
                                <p className="text-sm text-muted">
                                    Are you sure you want to remove this recipe from your favorites list?
                                </p>
                            </Modal.Body>

                            <Modal.Footer className="flex justify-end gap-2 mt-6">
                                <Button
                                    className="rounded-xl px-4 py-2 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setRecipeToRemove(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="rounded-xl px-4 py-2 text-sm font-medium bg-danger text-white hover:bg-danger/90 transition-colors"
                                    onClick={handleConfirmRemove}
                                >
                                    Remove
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    );
}