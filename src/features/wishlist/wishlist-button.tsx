"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  function getCurrentUrl() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(getCurrentUrl());
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlistAction(productId);

      if (!result.success) {
        toast.error(result.message || "Failed to update wishlist");
        return;
      }

      if (typeof result.isWishlisted === "boolean") {
        setIsWishlisted(result.isWishlisted);
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-full px-4 text-sm"
        disabled={isPending}
        onClick={handleClick}
      >
        <Heart
          className={cn(
            "mr-2 h-5 w-5",
            isWishlisted && "fill-current text-red-500",
          )}
        />
        {isWishlisted ? "Wishlisted" : "Add to wishlist"}
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
