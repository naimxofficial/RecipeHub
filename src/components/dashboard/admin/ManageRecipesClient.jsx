"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Star, Trash2, Edit3, Plus, X } from "lucide-react";
import { Button, Modal } from "@heroui/react";
import NextLink from "next/link";
import Image from "next/image";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Appetizer", "Beverage", "Salad", "Vegan"];
const CUISINES = ["Italian", "Mexican", "Indian", "Chinese", "Mediterranean", "American", "Thai", "Japanese", "French", "Middle Eastern", "Korean", "Spanish", "Greek", "Turkish", "Vietnamese"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error("ImgBB upload failed");
    return data.data.url;
}


const FieldLabel = ({ children, required }) => (
    <label className="text-xs font-semibold text-foreground/90 flex items-center gap-0.5">
        {children} {required && <span className="text-danger">*</span>}
    </label>
);

const FormInput = ({ className = "", ...props }) => (
    <input
        {...props}
        className={`w-full rounded-xl border border-separator bg-background px-4 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
    />
);

const FormSelect = ({ children, className = "", ...props }) => (
    <select
        {...props}
        className={`w-full rounded-xl border border-separator bg-background px-4 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary appearance-none ${className}`}
    >
        {children}
    </select>
);

const ModalImageUpload = ({ preview, uploading, onFileSelect }) => {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <FieldLabel required>Recipe Image</FieldLabel>
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-separator p-4 bg-background/50">
                <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-separator bg-background flex items-center justify-center">
                    {preview ? (
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                    ) : (
                        <span className="text-2xl text-muted">📷</span>
                    )
                    }
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <input 
                        type="file" 
                        accept="image/*" 
                        id="modal-image-file" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        disabled={uploading}
                    />
                    <label 
                        htmlFor="modal-image-file" 
                        className={`inline-flex items-center justify-center rounded-lg border border-separator px-3 py-1.5 text-xs font-medium bg-surface hover:bg-background cursor-pointer transition-colors text-center ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                        {uploading ? "Uploading to ImgBB..." : "Choose New Image"}
                    </label>
                </div>
            </div>
        </div>
    );
};

const ModalDynamicList = ({ label, placeholder, items = [], onChange }) => {
    const handleItemChange = (index, value) => {
        const updated = [...items];
        updated[index] = value;
        onChange(updated);
    };

    const addItem = () => onChange([...items, ""]);
    const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <FieldLabel>{label}</FieldLabel>
                <Button variant="light" size="sm" isIconOnly className="rounded-full min-w-0 size-6" onClick={addItem}>
                    <Plus className="size-3.5" />
                </Button>
            </div>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <FormInput
                            type="text"
                            placeholder={`${placeholder} #${index + 1}`}
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                        />
                        {items.length > 1 && (
                            <Button variant="light" color="danger" isIconOnly className="min-w-0 p-2 rounded-xl shrink-0" onClick={() => removeItem(index)}>
                                <X className="size-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function ManageRecipesClient({ adminId }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    const fetchRecipes = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/recipes?userId=${adminId}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setRecipes(data.recipes || []);
        } catch (err) {
            toast.error("Failed to load recipes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminId) fetchRecipes();
    }, [adminId]);

    const openEditModal = (recipe) => {
        setEditingRecipe({
            ...recipe,
            ingredients: recipe.ingredients ? [...recipe.ingredients] : ["", ""],
            instructions: recipe.instructions ? [...recipe.instructions] : ["", ""],
        });
        setImagePreview(recipe.recipeImage || "");
        setIsEditModalOpen(true);
    };

    const handleModalImageSelect = async (file) => {
        setUploadingImage(true);
        try {
            const url = await uploadToImgBB(file);
            setEditingRecipe(prev => ({ ...prev, recipeImage: url }));
            setImagePreview(url);
            toast.success("Image uploaded successfully");
        } catch {
            toast.error("Image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingRecipe) return;

        if (!editingRecipe.recipeName?.trim()) return toast.error("Recipe name is required");
        if (!editingRecipe.recipeImage) return toast.error("Recipe image is required");
        if (!editingRecipe.category) return toast.error("Category is required");

        const cleanIngredients = editingRecipe.ingredients.filter(i => i.trim());
        const cleanInstructions = editingRecipe.instructions.filter(i => i.trim());

        if (cleanIngredients.length === 0) return toast.error("At least one ingredient is required");
        if (cleanInstructions.length === 0) return toast.error("At least one instruction is required");

        setUpdating(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/recipes/${editingRecipe._id}?userId=${adminId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...editingRecipe,
                        ingredients: cleanIngredients,
                        instructions: cleanInstructions,
                        price: parseFloat(editingRecipe.price) || 0,
                    }),
                }
            );

            if (res.ok) {
                toast.success("Recipe updated successfully");
                setIsEditModalOpen(false);
                fetchRecipes();
            } else {
                toast.error("Failed to update recipe");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    const toggleFeature = async (recipeId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/admin/recipes/${recipeId}/feature?userId=${adminId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isFeatured: newStatus }),
                }
            );

            if (res.ok) {
                toast.success(`Recipe ${newStatus ? "featured" : "unfeatured"}`);
                setRecipes(prev => prev.map(r => r._id === recipeId ? { ...r, isFeatured: newStatus } : r));
            }
        } catch {
            toast.error("Failed to update featured status");
        }
    };

    const triggerDelete = (id, name) => {
        setRecipeToDelete({ id, name });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!recipeToDelete) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/admin/recipes/${recipeToDelete.id}?userId=${adminId}`,
                { method: "DELETE" }
            );
            if (res.ok) {
                toast.success("Recipe deleted successfully");
                setRecipes(prev => prev.filter(r => r._id !== recipeToDelete.id));
            }
        } catch {
            toast.error("Failed to delete");
        } finally {
            setIsDeleteModalOpen(false);
            setRecipeToDelete(null);
        }
    };

    if (loading) return <div className="py-12 text-center">Loading recipes...</div>;

    return (
        <>
            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-separator bg-surface">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-separator bg-background">
                            <th className="px-6 py-4 text-left">Recipe</th>
                            <th className="px-6 py-4 text-left">Author</th>
                            <th className="px-6 py-4 text-left">Category</th>
                            <th className="px-6 py-4 text-center">Featured</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-separator">
                        {recipes.map((recipe) => (
                            <tr key={recipe._id} className="hover:bg-background/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-lg overflow-hidden border border-separator relative shrink-0">
                                            <Image fill src={recipe.recipeImage} alt={recipe.recipeName} className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium line-clamp-1">{recipe.recipeName}</p>
                                            <p className="text-xs text-muted">{recipe.preparationTime}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted">{recipe.authorName}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs">{recipe.category}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => toggleFeature(recipe._id, recipe.isFeatured)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium transition-all ${recipe.isFeatured ? "bg-amber-500/10 text-amber-500" : "bg-surface text-muted hover:bg-surface"}`}>
                                        <Star className={`size-3.5 ${recipe.isFeatured ? "fill-current" : ""}`} />
                                        {recipe.isFeatured ? "Featured" : "Feature"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Button variant="bordered" size="sm" onClick={() => openEditModal(recipe)}>
                                            <Edit3 className="size-4" />
                                        </Button>
                                        <Button color="danger" size="sm" onClick={() => triggerDelete(recipe._id, recipe.recipeName)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Recipe Configuration Modal */}
            <Modal>
                <Modal.Backdrop 
                    isOpen={isEditModalOpen} 
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsEditModalOpen(false);
                            setEditingRecipe(null);
                        }
                    }}
                    className="bg-black/40 backdrop-blur-sm"
                >
                    <Modal.Container>
                        <Modal.Dialog className="bg-surface text-foreground sm:max-w-150 w-full max-h-[85vh] overflow-y-auto border border-separator shadow-xl rounded-2xl relative p-6">
                            <Button
                                variant="light"
                                size="sm"
                                className="absolute top-4 right-4 min-w-0 p-2 z-50 rounded-full"
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingRecipe(null);
                                }}
                            >
                                ✕
                            </Button>
                            {editingRecipe && (
                                <form onSubmit={handleUpdateSubmit} noValidate>
                                    <Modal.Header className="p-0 mb-4">
                                        <Modal.Heading className="text-lg font-bold">Edit Recipe Configuration</Modal.Heading>
                                    </Modal.Header>

                                    <Modal.Body className="gap-5 py-2 p-0 flex flex-col">
                                        <div className="flex flex-col gap-1.5">
                                            <FieldLabel required>Recipe name</FieldLabel>
                                            <FormInput
                                                type="text"
                                                placeholder="e.g. Brown Butter Garlic Pasta"
                                                value={editingRecipe.recipeName}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, recipeName: e.target.value })}
                                            />
                                        </div>

                                        <ModalImageUpload
                                            preview={imagePreview}
                                            uploading={uploadingImage}
                                            onFileSelect={handleModalImageSelect}
                                        />

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
                                                    value={editingRecipe.cuisineType || ""}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, cuisineType: e.target.value })}
                                                >
                                                    <option value="">Select cuisine</option>
                                                    {CUISINES.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </FormSelect>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="flex flex-col gap-1.5">
                                                <FieldLabel required>Difficulty</FieldLabel>
                                                <FormSelect
                                                    value={editingRecipe.difficultyLevel || ""}
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
                                                    value={editingRecipe.preparationTime || ""}
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
                                                    value={editingRecipe.price || ""}
                                                    onChange={(e) => setEditingRecipe({ ...editingRecipe, price: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <hr className="border-separator my-2" />

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

                                    <Modal.Footer className="mt-6 flex justify-end gap-2 p-0">
                                        <Button
                                            variant="bordered"
                                            onClick={() => {
                                                setIsEditModalOpen(false);
                                                setEditingRecipe(null);
                                            }}
                                            isDisabled={updating || uploadingImage}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="primary"
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
                                    Are you sure you want to delete {recipeToDelete?.name ? `"${recipeToDelete.name}"` : "this recipe"}? This action is permanent and cannot be undone.
                                </p>
                            </Modal.Body>

                            <Modal.Footer className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="bordered"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setRecipeToDelete(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
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