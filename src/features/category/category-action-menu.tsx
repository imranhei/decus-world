"use client";

import { Edit, MoreHorizontal, Power, PowerOff } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toggleCategoryStatusAction } from "@/server/actions/admin-category-actions";

type CategoryActionMenuProps = {
  categoryId: string;
  categoryName: string;
  isActive: boolean;
};

export function CategoryActionMenu({
  categoryId,
  categoryName,
  isActive,
}: CategoryActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggleStatus() {
    startTransition(async () => {
      const result = await toggleCategoryStatusAction(categoryId);

      if (result?.success === false) {
        toast.error(result.message || "Failed to update category status");
        return;
      }

      toast.success(
        result?.message ||
          `${categoryName} has been ${
            isActive ? "disabled" : "enabled"
          }.`,
      );

      setOpen(false);
    });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div
          className="h-8 w-8 rounded-full border bg-muted/50 flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted/70"
          aria-label={`Open actions for ${categoryName}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>
          <Link
            href={`/admin/categories/${categoryId}/edit`}
            className="flex items-center w-full cursor-default"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isPending}
          onClick={(event) => {
            event.preventDefault();
            handleToggleStatus();
          }}
          className={
            isActive
              ? "text-orange-600 focus:text-orange-600"
              : "text-green-600 focus:text-green-600"
          }
        >
          {isActive ? (
            <PowerOff className="mr-2 h-4 w-4" />
          ) : (
            <Power className="mr-2 h-4 w-4" />
          )}

          {isPending
            ? "Updating..."
            : isActive
              ? "Disable"
              : "Enable"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}