"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaCartShopping,
  FaCrown,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import ReportModal from "./ReportModal";

export default function RecipeActions({
  recipe,
  user,
  initialLiked,
  initialFavorited,
  initialLikesCount,
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const requireAuth = () => {
    toast.error("Please log in to continue.");
    router.push(`/login?callbackUrl=/recipes/${recipe._id}`);
  };

  // Like / unlike toggle
  const handleLike = async () => {
    if (!user) return requireAuth();
    setLikeLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/recipes/${recipe._id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, userEmail: user.email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch {
      toast.error("Couldn't update like. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  // Favorite / unfavorite toggle
  const handleFavorite = async () => {
    if (!user) return requireAuth();
    setFavLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/recipes/${recipe._id}/favorite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, userEmail: user.email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFavorited(data.favorited);
      toast.success(
        data.favorited ? "Added to favorites!" : "Removed from favorites."
      );
    } catch {
      toast.error("Couldn't update favorites. Please try again.");
    } finally {
      setFavLoading(false);
    }
  };

  // Purchase / tip (Stripe — wired up in Phase 5)
  const handlePurchase = async () => {
    if (!user) return requireAuth();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/payments/create-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipeId: recipe._id,
            recipeName: recipe.recipeName,
            price: recipe.price,
            userId: user.id,
            userEmail: user.email,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
    }
  };

  return (
    <>
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          disabled={likeLoading}
          aria-label={liked ? "Unlike recipe" : "Like recipe"}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            liked
              ? "border-accent bg-accent/10 text-accent"
              : "border-separator bg-surface text-surface-foreground hover:border-accent/50 hover:text-accent"
          }`}
        >
          {liked ? (
            <FaHeart className="size-4 text-accent" />
          ) : (
            <FaRegHeart className="size-4" />
          )}
          <span>{likesCount}</span>
          <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
        </button>

        {/* Favorite */}
        <button
          type="button"
          onClick={handleFavorite}
          disabled={favLoading}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            favorited
              ? "border-warning bg-warning/10 text-warning"
              : "border-separator bg-surface text-surface-foreground hover:border-warning/50 hover:text-warning"
          }`}
        >
          {favorited ? (
            <FaBookmark className="size-4 text-warning" />
          ) : (
            <FaRegBookmark className="size-4" />
          )}
          <span className="hidden sm:inline">
            {favorited ? "Saved" : "Save"}
          </span>
        </button>

        {/* Report */}
        <button
          type="button"
          onClick={() => {
            if (!user) return requireAuth();
            setShowReport(true);
          }}
          aria-label="Report recipe"
          className="flex items-center gap-2 rounded-full border border-separator bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-danger/50 hover:text-danger"
        >
          <FaFlag className="size-4" />
          <span className="hidden sm:inline">Report</span>
        </button>

        {/* Purchase / tip */}
        <Button
          variant="primary"
          onPress={handlePurchase}
          className="ml-auto flex items-center gap-2"
        >
          <FaCartShopping className="size-4" />
          Support · ${recipe.price?.toFixed(2) ?? "—"}
        </Button>
      </div>

      {/* Report modal */}
      {showReport && user && (
        <ReportModal
          recipeId={recipe._id}
          reporterEmail={user.email}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}