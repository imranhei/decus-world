"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlistAction } from "@/server/actions/wishlist-actions";

type WishlistButtonProps = {
  productId: string;
  isLoggedIn: boolean;
  initialWishlisted: boolean;
  variant?: "icon" | "full";
};

export function WishlistButton({
  productId,
  isLoggedIn,
  initialWishlisted,
  variant = "icon",
}: WishlistButtonProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlistAction(productId);

      if (result.success && typeof result.isWishlisted === "boolean") {
        setIsWishlisted(result.isWishlisted);
      }
    });
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={isPending}
        onClick={handleClick}
      >
        <Heart
          className={cn(
            "mr-2 h-5 w-5",
            isWishlisted && "fill-current text-red-500",
          )}
        />
        {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      disabled={isPending}
      onClick={handleClick}
      className="rounded-full"
    >
      <Heart
        className={cn("h-5 w-5", isWishlisted && "fill-current text-red-500")}
      />
    </Button>
  );
}
