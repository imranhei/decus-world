"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type UserCartActionsProps = {
  cartItemId: string;
  quantity: number;
};

export function UserCartActions({
  cartItemId,
  quantity,
}: UserCartActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateQuantity(nextQuantity: number) {
    startTransition(async () => {
      const result = await updateCartItemQuantityAction({
        cartItemId,
        quantity: nextQuantity,
      });

      if (!result.success) {
        toast.error(result.message || "Failed to update cart");
        return;
      }

      router.refresh();
    });
  }

  function removeItem() {
    startTransition(async () => {
      const result = await removeCartItemAction(cartItemId);

      if (!result.success) {
        toast.error(result.message || "Failed to remove item");
        return;
      }

      toast.success("Item removed");
      router.refresh();
    });
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => updateQuantity(quantity - 1)}
      >
        -
      </Button>

      <span className="w-8 text-center">{quantity}</span>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => updateQuantity(quantity + 1)}
      >
        +
      </Button>

      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={removeItem}
      >
        <Trash className="h-4 w-4 text-rose-500" />
      </Button>
    </div>
  );
}