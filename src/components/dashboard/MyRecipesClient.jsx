"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Modal, useOverlayState, Spinner } from "@heroui/react";
import {
    Pencil,
    Trash2,
    Plus,
    ArrowUp,
    ArrowDown,
    Trash,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    UploadCloud
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Configuration Lookups
const CATEGORIES = [
    "Breakfast", "Lunch", "Dinner", "Dessert",
    "Appetizer", "Beverage", "Salad", "Vegan",
];
const CUISINES = [
    "Italian", "Mexican", "Indian", "Chinese", "Mediterranean",
    "American", "Thai", "Japanese", "French", "Middle Eastern",
    "Korean", "Spanish", "Greek", "Turkish", "Vietnamese",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];



// ── ImgBB Upload Handler
async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!data.success) throw new Error("ImgBB upload failed");
    return data.data.url;
}

// ── Sub-components for Form Layout
function FieldLabel({ children, required }) {
    return (
        <label className="block text-sm font-medium text-surface-foreground">
            {children}
            {required && <span className="ml-1 text-accent">*</span>}
        </label>
    );
}

function FormInput({ className = "", ...props }) {
    return (
        <input
            className={`w-full rounded-xl border border-separator bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${className}`}
            {...props}
        />
    );
}

function FormSelect({ children, className = "", ...props }) {
    return (
        <select
            className={`w-full rounded-xl border border-separator bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 [&>option]:bg-background [&>option]:text-foreground ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

// ── Dynamic Array Component
function ModalDynamicList({ label, placeholder, items = [], onChange }) {
    const addItem = () => onChange([...items, ""]);
    const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));
    const updateItem = (i, val) => onChange(items.map((item, idx) => (idx === i ? val : item)));

    const moveUp = (i) => {
        if (i === 0) return;
        const next = [...items];
        [next[i - 1], next[i]] = [next[i], next[i - 1]];
        onChange(next);
    };

    const moveDown = (i) => {
        if (i === items.length - 1) return;
        const next = [...items];
        [next[i], next[i + 1]] = [next[i + 1], next[i]];
        onChange(next);
    };



    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <FieldLabel required>{label}</FieldLabel>
                <span className="text-xs text-muted">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-display text-xs font-bold text-accent">
                            {i + 1}
                        </span>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(i, e.target.value)}
                            placeholder={`${placeholder} ${i + 1}`}
                            className="flex-1 rounded-xl border border-separator bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                        <div className="flex shrink-0 gap-1">
                            <button
                                type="button"
                                onClick={() => moveUp(i)}
                                disabled={i === 0}
                                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-30"
                            >
                                <ArrowUp className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveDown(i)}
                                disabled={i === items.length - 1}
                                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-30"
                            >
                                <ArrowDown className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeItem(i)}
                                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                            >
                                <Trash className="size-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 self-start rounded-xl border border-dashed border-separator px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
                <Plus className="size-3.5" />
                Add {label.toLowerCase().replace(" *", "")}
            </button>
        </div>
    );
}

// Image Upload Element
function ModalImageUpload({ preview, uploading, onFileSelect }) {
    const inputRef = useRef(null);

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel required>Recipe image</FieldLabel>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`relative flex min-h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${preview ? "border-accent/40" : "border-separator hover:border-accent/60"
                    }`}
            >
                {preview ? (
                    <>
                        <Image
                            width={400}
                            height={300}
                            src={preview}
                            alt="Recipe preview"
                            className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                            {uploading ? (
                                <Loader2 className="size-6 animate-spin text-white" />
                            ) : (
                                <>
                                    <UploadCloud className="size-6 text-white" />
                                    <span className="text-xs font-medium text-white">Click to change image</span>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {uploading ? (
                            <Loader2 className="size-8 animate-spin text-accent" />
                        ) : (
                            <ImageIcon className="size-8 text-muted" />
                        )}
                        <div className="text-center">
                            <p className="text-sm font-medium text-surface-foreground">
                                {uploading ? "Uploading…" : "Click to upload image"}
                            </p>
                            <p className="text-xs text-muted">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                    </>
                )}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelect(file);
                    e.target.value = "";
                }}
            />
            {preview && !uploading && (
                <p className="flex items-center gap-1.5 text-xs text-success">
                    <CheckCircle2 className="size-3.5" />
                    Image source set successfully
                </p>
            )}
        </div>
    );
}

// ── Main Dashboard Layout Module
export default function MyRecipesClient({ userId, userEmail }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Track dynamic form fields inside state
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const modalState = useOverlayState();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);


    useEffect(() => {
        const fetchMyRecipes = async () => {
            // Only attempt fetch if both necessary user variables are populated
            if (!userId || !userEmail) return;

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/my-recipes?userId=${userId}&userEmail=${encodeURIComponent(userEmail)}`
                );
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();
                setRecipes(data);
            } catch (err) {
                toast.error("Failed to load your recipes");
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, [userId, userEmail]);

    // Deep copy selected row into modal form state
    const handleEditClick = (recipe) => {
        setEditingRecipe({
            ...recipe,
            recipeName: recipe.recipeName || "",
            category: recipe.category || "",
            cuisineType: recipe.cuisineType || "",
            difficultyLevel: recipe.difficultyLevel || "",
            preparationTime: recipe.preparationTime || "",
            price: recipe.price ?? "",
            ingredients: recipe.ingredients ? [...recipe.ingredients] : ["", ""],
            instructions: recipe.instructions ? [...recipe.instructions] : ["", ""],
        });
        setImagePreview(recipe.recipeImage || "");
        modalState.open();
    };

    const handleModalImageSelect = async (file) => {
        setUploadingImage(true);
        try {
            const url = await uploadToImgBB(file);
            setEditingRecipe(prev => ({ ...prev, recipeImage: url }));
            setImagePreview(url);
            toast.success("New image uploaded!");
        } catch {
            toast.error("Image asset upload failed.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingRecipe) return;

        // Direct Input Field Validation
        if (!editingRecipe.recipeName.trim()) return toast.error("Recipe name is required.");
        if (!editingRecipe.recipeImage) return toast.error("Please provide an image.");
        if (!editingRecipe.category) return toast.error("Please pick a category.");
        if (!editingRecipe.cuisineType) return toast.error("Please pick a cuisine.");
        if (!editingRecipe.difficultyLevel) return toast.error("Please select difficulty.");
        if (!editingRecipe.preparationTime.trim()) return toast.error("Preparation time is required.");
        if (isNaN(parseFloat(editingRecipe.price)) || parseFloat(editingRecipe.price) < 0) {
            return toast.error("Enter a valid price config.");
        }

        const cleanIngredients = editingRecipe.ingredients.filter((i) => i.trim());
        if (cleanIngredients.length === 0) return toast.error("Add at least one item ingredient.");

        const cleanInstructions = editingRecipe.instructions.filter((i) => i.trim());
        if (cleanInstructions.length === 0) return toast.error("Add at least one process step.");

        setUpdating(true);

        const fullPayload = {
            ...editingRecipe,
            recipeName: editingRecipe.recipeName.trim(),
            preparationTime: editingRecipe.preparationTime.trim(),
            price: parseFloat(editingRecipe.price),
            ingredients: cleanIngredients,
            instructions: cleanInstructions,
        };

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/recipes/${editingRecipe._id}?userId=${userId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fullPayload),
                }
            );

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Recipe entry updated successfully! 🎉");

                // Sync modified database properties into state view array
                setRecipes((prev) => prev.map((r) => (r._id === editingRecipe._id ? fullPayload : r)));
                modalState.close();
            } else {
                toast.error(data.error || "Failed to update changes.");
            }
        } catch {
            toast.error("Something went wrong saving form updates.");
        } finally {
            setUpdating(false);
        }
    };

    const triggerDelete = (recipeId) => {
        setRecipeToDelete(recipeId);
        setIsDeleteModalOpen(true);
    };


    // Step 2: The actual API call fired from inside the confirmation modal
    const handleConfirmDelete = async () => {
        if (!recipeToDelete) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/recipes/${recipeToDelete}?userId=${userId}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                toast.success("Recipe removed successfully");
                setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete));
            } else {
                toast.error("Failed to drop record document");
            }
        } catch {
            toast.error("Network communication failure");
        } finally {
            // Always clean up state and close the modal
            setIsDeleteModalOpen(false);
            setRecipeToDelete(null);
        }
    };

    if (loading) return (<div className="flex flex-col items-center gap-2 text-center py-12 text-sm text-muted">Loading your recipes...
        <Spinner color='accent' size="xl" />
    </div>);

    if (recipes.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-separator py-20 text-center bg-surface">
                <p className="text-muted text-sm">You haven&apos;t added any recipes yet.</p>
                <Link
                    href="/dashboard/add-recipe"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                >
                    <Plus className="size-4" />
                    Add Your First Recipe
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Content Rendering Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <div
                        key={recipe._id}
                        className="group rounded-2xl border border-separator bg-surface overflow-hidden hover:shadow-lg transition-all"
                    >
                        <div className="relative aspect-4/3">
                            <Image
                                loading='eager'
                                width={400}
                                height={300}
                                src={recipe.recipeImage}
                                alt={recipe.recipeName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="min-w-0 p-2 bg-surface/80 backdrop-blur-sm"
                                    onClick={() => handleEditClick(recipe)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="min-w-0 p-2 bg-surface/80 backdrop-blur-sm text-danger hover:bg-danger/10"
                                    onClick={() => triggerDelete(recipe._id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-display font-semibold text-lg line-clamp-2 text-foreground">
                                {recipe.recipeName}
                            </h3>
                            <p className="text-sm text-muted mt-1">
                                {recipe.category} • {recipe.cuisineType || "General"} • {recipe.preparationTime}
                            </p>
                            <p className="text-sm font-bold text-accent mt-2">
                                ${typeof recipe.price === "number" ? recipe.price.toFixed(2) : recipe.price}
                            </p>

                            <div className="mt-4 flex gap-2">
                                <Link
                                    href={`/recipes/${recipe._id}`}
                                    className="flex-1 text-center py-2.5 rounded-xl border border-separator bg-background hover:bg-surface text-sm font-medium transition-colors"
                                >
                                    View
                                </Link>
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => handleEditClick(recipe)}
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HeroUI v3 Compound Dynamic Form Overlay Modal */}
            <Modal state={modalState}>
                <Modal.Backdrop variant="blur">
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-150 w-full max-h-[85vh] overflow-y-auto">
                            <Button
                                variant="light"
                                size="sm"
                                className="absolute top-4 right-4 min-w-0 p-2 z-50 rounded-full"
                                onClick={modalState.close}
                            >
                                ✕
                            </Button>
                            {editingRecipe && (
                                <form onSubmit={handleUpdateSubmit} noValidate>
                                    <Modal.Header>
                                        <Modal.Heading>Edit Recipe Configuration</Modal.Heading>
                                    </Modal.Header>

                                    <Modal.Body className="gap-5 py-2">
                                        {/* Input field text title */}
                                        <div className="flex flex-col gap-1.5">
                                            <FieldLabel required>Recipe name</FieldLabel>
                                            <FormInput
                                                type="text"
                                                placeholder="e.g. Brown Butter Garlic Pasta"
                                                value={editingRecipe.recipeName}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, recipeName: e.target.value })}
                                            />
                                        </div>

                                        {/* ImgBB Dynamic Handling Layout block */}
                                        <ModalImageUpload
                                            preview={imagePreview}
                                            uploading={uploadingImage}
                                            onFileSelect={handleModalImageSelect}
                                        />

                                        {/* Category + Cuisine Dropdowns */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-1.5">
                                                <FieldLabel required>Category</FieldLabel>
                                                <FormSelect
                                                    value={editingRecipe.category}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                                                >
                                                    <option value="">Select category</option>
                                                    {CATEGORIES.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </FormSelect>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <FieldLabel required>Cuisine type</FieldLabel>
                                                <FormSelect
                                                    value={editingRecipe.cuisineType}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, cuisineType: e.target.value })}
                                                >
                                                    <option value="">Select cuisine</option>
                                                    {CUISINES.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </FormSelect>
                                            </div>
                                        </div>

                                        {/* Difficulty + Timing Info + Pricing structures */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <FieldLabel required>Difficulty</FieldLabel>
                                                <FormSelect
                                                    value={editingRecipe.difficultyLevel}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, difficultyLevel: e.target.value })}
                                                >
                                                    <option value="">Select difficulty</option>
                                                    {DIFFICULTIES.map((d) => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </FormSelect>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <FieldLabel required>Preparation time</FieldLabel>
                                                <FormInput
                                                    type="text"
                                                    placeholder="e.g. 30 mins"
                                                    value={editingRecipe.preparationTime}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, preparationTime: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <FieldLabel required>Price (USD)</FieldLabel>
                                                <FormInput
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="e.g. 4.99"
                                                    value={editingRecipe.price}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, price: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <hr className="border-separator my-2" />

                                        {/* Dynamic List Renderers */}
                                        <ModalDynamicList
                                            label="Ingredients *"
                                            placeholder="Ingredient"
                                            items={editingRecipe.ingredients}
                                            onChange={(updated) => setEditingRecipe({ ...editingRecipe, ingredients: updated })}
                                        />

                                        <ModalDynamicList
                                            label="Instructions *"
                                            placeholder="Step"
                                            items={editingRecipe.instructions}
                                            onChange={(updated) => setEditingRecipe({ ...editingRecipe, instructions: updated })}
                                        />
                                    </Modal.Body>

                                    <Modal.Footer className="mt-4">
                                        <Button
                                            variant="secondary"
                                            onClick={modalState.close}
                                            isDisabled={updating || uploadingImage}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            isLoading={updating}
                                            isDisabled={uploadingImage}
                                        >
                                            Save Recipe Updates
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            )}
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal>
                <Modal.Backdrop
                    isOpen={isDeleteModalOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsDeleteModalOpen(false);
                            setRecipeToDelete(null);
                        }
                    }}
                    className="bg-black/40 backdrop-blur-sm"
                >
                    <Modal.Container>
                        <Modal.Dialog className="bg-surface text-foreground rounded-2xl max-w-md p-6 border border-separator shadow-xl">

                            <Modal.Header>
                                <Modal.Heading className="text-lg font-bold">
                                    Confirm Deletion
                                </Modal.Heading>
                            </Modal.Header>

                            <Modal.Body className="mt-2">
                                <p className="text-sm text-muted">
                                    Are you sure you want to delete this recipe? This action is permanent and cannot be undone.
                                </p>
                            </Modal.Body>

                            <Modal.Footer className="flex justify-end gap-2 mt-6">
                                <Button
                                    className="rounded-xl px-4 py-2 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setRecipeToDelete(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="rounded-xl px-4 py-2 text-sm font-medium bg-danger text-white hover:bg-danger/90 transition-colors"
                                    onClick={handleConfirmDelete}
                                >
                                    Delete Recipe
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    );
}