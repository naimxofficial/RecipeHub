"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
    FaImage,
    FaPlus,
    FaTrash,
    FaArrowUp,
    FaArrowDown,
    FaCrown,
    FaCircleCheck,
    FaSpinner,
    FaCloudArrowUp,
} from "react-icons/fa6";
import Image from "next/image";

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

// ── ImgBB upload helper ──────────────────────────────────
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

// ── Small sub-components ─────────────────────────────────
function FieldLabel({ children, required }) {
    return (
        <label className="block text-sm font-medium text-surface-foreground">
            {children}
            {required && <span className="ml-1 text-accent">*</span>}
        </label>
    );
}

function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full rounded-xl border border-separator bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${className}`}
            {...props}
        />
    );
}

function Select({ children, className = "", ...props }) {
    return (
        <select
            className={`w-full rounded-xl border border-separator bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

// ── Dynamic list (ingredients / instructions) ─────────────
function DynamicList({ label, placeholder, items, onChange }) {
    const addItem = () => onChange([...items, ""]);
    const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));
    const updateItem = (i, val) =>
        onChange(items.map((item, idx) => (idx === i ? val : item)));
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
                                <FaArrowUp className="size-3" />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveDown(i)}
                                disabled={i === items.length - 1}
                                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-30"
                            >
                                <FaArrowDown className="size-3" />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeItem(i)}
                                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                            >
                                <FaTrash className="size-3" />
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
                <FaPlus className="size-3" />
                Add {label.toLowerCase().replace(" *", "")}
            </button>
        </div>
    );
}

// ── Image upload zone ─────────────────────────────────────
function ImageUpload({ preview, uploading, onFileSelect }) {
    const inputRef = useRef(null);

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel required>Recipe image</FieldLabel>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`relative flex min-h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${preview
                    ? "border-accent/40"
                    : "border-separator hover:border-accent/60"
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
                                <FaSpinner className="size-6 animate-spin text-white" />
                            ) : (
                                <>
                                    <FaCloudArrowUp className="size-6 text-white" />
                                    <span className="text-xs font-medium text-white">
                                        Click to change image
                                    </span>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {uploading ? (
                            <FaSpinner className="size-8 animate-spin text-accent" />
                        ) : (
                            <FaImage className="size-8 text-muted" />
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
                    <FaCircleCheck className="size-3.5" />
                    Image uploaded successfully
                </p>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────
export default function AddRecipePage() {
    const router = useRouter();

    const [form, setForm] = useState({
        recipeName: "",
        category: "",
        cuisineType: "",
        difficultyLevel: "",
        preparationTime: "",
        price: "",
    });
    const [ingredients, setIngredients] = useState(["", ""]);
    const [instructions, setInstructions] = useState(["", ""]);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // Handle ImgBB upload
    const handleImageSelect = async (file) => {
        setUploading(true);
        setErrors((prev) => ({ ...prev, image: undefined }));
        try {
            const url = await uploadToImgBB(file);
            setImageUrl(url);
            setImagePreview(url);
        } catch {
            toast.error("Image upload failed. Please try again.");
            setErrors((prev) => ({ ...prev, image: "Image upload failed." }));
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.recipeName.trim()) errs.recipeName = "Recipe name is required.";
        if (!imageUrl) errs.image = "Please upload a recipe image.";
        if (!form.category) errs.category = "Please select a category.";
        if (!form.cuisineType) errs.cuisineType = "Please select a cuisine.";
        if (!form.difficultyLevel) errs.difficultyLevel = "Please select a difficulty.";
        if (!form.preparationTime.trim()) errs.preparationTime = "Preparation time is required.";
        if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)
            errs.price = "Enter a valid price (e.g. 4.99).";
        const filledIngredients = ingredients.filter((i) => i.trim());
        if (filledIngredients.length === 0)
            errs.ingredients = "Add at least one ingredient.";
        const filledInstructions = instructions.filter((i) => i.trim());
        if (filledInstructions.length === 0)
            errs.instructions = "Add at least one instruction step.";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const session = await authClient.getSession();
            const user = session?.data?.user;
            if (!user) {
                toast.error("Session expired. Please log in again.");
                router.push("/login");
                return;
            }

            // Get isPremium from user doc via a lightweight check
            const userRes = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/users/${user.id}/premium-status`
            );
            const userData = userRes.ok ? await userRes.json() : { isPremium: false };

            const payload = {
                recipeName: form.recipeName.trim(),
                recipeImage: imageUrl,
                category: form.category,
                cuisineType: form.cuisineType,
                difficultyLevel: form.difficultyLevel,
                preparationTime: form.preparationTime.trim(),
                price: parseFloat(form.price),
                ingredients: ingredients.filter((i) => i.trim()),
                instructions: instructions.filter((i) => i.trim()),
                authorId: user.id,
                authorName: user.name,
                authorEmail: user.email,
                isPremium: userData.isPremium,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/recipes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.limitReached) {
                    toast.error("You've reached the 2-recipe limit. Upgrade to Premium!");
                    router.push("/dashboard/premium");
                    return;
                }
                toast.error(data.error || "Failed to add recipe.");
                return;
            }

            toast.success("Recipe added successfully! 🎉");
            router.push("/dashboard/my-recipes");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    <span className="size-1.5 rounded-full bg-accent" />
                    Dashboard
                </span>
                <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
                    Add new recipe
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Share your recipe with the RecipeHub community.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-6">

                    {/* Basic info card */}
                    <div className="rounded-2xl border border-separator bg-surface p-6">
                        <h2 className="mb-5 font-display text-base font-semibold text-surface-foreground">
                            Basic information
                        </h2>
                        <div className="flex flex-col gap-5">

                            {/* Recipe name */}
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel required>Recipe name</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. Brown Butter Garlic Pasta"
                                    value={form.recipeName}
                                    onChange={set("recipeName")}
                                />
                                {errors.recipeName && (
                                    <p className="text-xs text-danger">{errors.recipeName}</p>
                                )}
                            </div>

                            {/* Image upload */}
                            <div className="flex flex-col gap-1.5">
                                <ImageUpload
                                    preview={imagePreview}
                                    uploading={uploading}
                                    onFileSelect={handleImageSelect}
                                />
                                {errors.image && (
                                    <p className="text-xs text-danger">{errors.image}</p>
                                )}
                            </div>

                            {/* Category + Cuisine */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <FieldLabel required>Category</FieldLabel>
                                    <Select value={form.category} onChange={set("category")}>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </Select>
                                    {errors.category && (
                                        <p className="text-xs text-danger">{errors.category}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FieldLabel required>Cuisine type</FieldLabel>
                                    <Select value={form.cuisineType} onChange={set("cuisineType")}>
                                        <option value="">Select cuisine</option>
                                        {CUISINES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </Select>
                                    {errors.cuisineType && (
                                        <p className="text-xs text-danger">{errors.cuisineType}</p>
                                    )}
                                </div>
                            </div>

                            {/* Difficulty + Prep time + Price */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="flex flex-col gap-1.5">
                                    <FieldLabel required>Difficulty</FieldLabel>
                                    <Select value={form.difficultyLevel} onChange={set("difficultyLevel")}>
                                        <option value="">Select difficulty</option>
                                        {DIFFICULTIES.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </Select>
                                    {errors.difficultyLevel && (
                                        <p className="text-xs text-danger">{errors.difficultyLevel}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FieldLabel required>Preparation time</FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 30 mins"
                                        value={form.preparationTime}
                                        onChange={set("preparationTime")}
                                    />
                                    {errors.preparationTime && (
                                        <p className="text-xs text-danger">{errors.preparationTime}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FieldLabel required>Price (USD)</FieldLabel>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g. 4.99"
                                        value={form.price}
                                        onChange={set("price")}
                                    />
                                    {errors.price && (
                                        <p className="text-xs text-danger">{errors.price}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients card */}
                    <div className="rounded-2xl border border-separator bg-surface p-6">
                        <DynamicList
                            label="Ingredients *"
                            placeholder="Ingredient"
                            items={ingredients}
                            onChange={setIngredients}
                        />
                        {errors.ingredients && (
                            <p className="mt-2 text-xs text-danger">{errors.ingredients}</p>
                        )}
                    </div>

                    {/* Instructions card */}
                    <div className="rounded-2xl border border-separator bg-surface p-6">
                        <DynamicList
                            label="Instructions *"
                            placeholder="Step"
                            items={instructions}
                            onChange={setInstructions}
                        />
                        {errors.instructions && (
                            <p className="mt-2 text-xs text-danger">{errors.instructions}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <NextLink href="/dashboard/my-recipes">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </NextLink>
                        <Button
                            variant="primary"
                            type="submit"
                            isDisabled={submitting || uploading}
                        >
                            {submitting ? (
                                <FaSpinner className="size-4 animate-spin" />
                            ) : (
                                <FaPlus className="size-4" />
                            )}
                            {submitting ? "Adding recipe…" : "Add recipe"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}