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
} from "react-icons/fa6";
import { toast } from "react-toastify";
import ReportModal from "./ReportModal";

export default function RecipeActions({
  recipe,
  user,
  initialLiked,
  initialFavorited,
  initialLikesCount,
  purchased,           // New prop from parent
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const requireAuth = () => {
    toast.error("Please log in to continue.");
    router.push(`/login?callbackUrl=/recipes/${recipe._id}`);
  };

  // Like Toggle
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

  // Favorite Toggle
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
      toast.success(data.favorited ? "Added to favorites!" : "Removed from favorites.");
    } catch {
      toast.error("Couldn't update favorites. Please try again.");
    } finally {
      setFavLoading(false);
    }
  };

  // Purchase Recipe (Stripe Checkout)
  const handlePurchase = async () => {
    if (!user) return requireAuth();
    if (purchased) {
      toast.info("You already own this recipe.");
      return;
    }

    setPurchaseLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/payments/create-recipe-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            recipeId: recipe._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to start checkout.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            liked
              ? "border-accent bg-accent/10 text-accent"
              : "border-separator bg-surface text-surface-foreground hover:border-accent/50 hover:text-accent"
          }`}
        >
          {liked ? <FaHeart className="size-4 text-accent" /> : <FaRegHeart className="size-4" />}
          <span>{likesCount}</span>
        </button>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavorite}
          disabled={favLoading}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            favorited
              ? "border-warning bg-warning/10 text-warning"
              : "border-separator bg-surface text-surface-foreground hover:border-warning/50 hover:text-warning"
          }`}
        >
          {favorited ? <FaBookmark className="size-4 text-warning" /> : <FaRegBookmark className="size-4" />}
        </button>

        {/* Report Button */}
        <button
          type="button"
          onClick={() => {
            if (!user) return requireAuth();
            setShowReport(true);
          }}
          className="flex items-center gap-2 rounded-full border border-separator bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-danger/50 hover:text-danger"
        >
          <FaFlag className="size-4" />
          <span className="hidden sm:inline">Report</span>
        </button>

        {/* Purchase Button */}
        {!purchased && recipe.price > 0 && (
          <Button
            variant="primary"
            onPress={handlePurchase}
            isDisabled={purchaseLoading}
            className="ml-auto flex items-center gap-2 bg-linear-to-r from-accent to-orange-600 hover:brightness-105"
          >
            {purchaseLoading ? (
              "Processing..."
            ) : (
              <>
                <FaCartShopping className="size-4" />
                Buy Recipe — ${recipe.price?.toFixed(2) ?? "0.00"}
              </>
            )}
          </Button>
        )}

        {/* Already Purchased Badge */}
        {purchased && (
          <div className="ml-auto flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
            <span>✓</span> Already Purchased
          </div>
        )}
      </div>

      {/* Report Modal */}
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