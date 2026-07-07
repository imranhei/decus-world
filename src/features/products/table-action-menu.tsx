"use client";

import { Archive, Edit, Trash2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
//   archiveProductAction,
  deleteProductAction,
} from "@/server/actions/admin-product-actions";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal } from "lucide-react";

type Props = {
    productId: string;
    productName: string;
};

export function ProductActionMenu({ productId, productName }: Props) {
//   const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

//   async function handleArchive() {
//     setLoading(true);

//     const result = await archiveProductAction(productId);

//     setLoading(false);

//     if (result.success) {
//       toast.success(result.message);
//       setArchiveOpen(false);
//     } else {
//       toast.error(result.message);
//     }
//   }

  async function handleDelete() {
    setLoading(true);

    const result = await deleteProductAction(productId);

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setDeleteOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center justify-center border bg-muted/50 rounded-full p-1 hover:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              href={`/admin/products/${productId}/edit`}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* <DropdownMenuItem
            className="text-orange-600 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setArchiveOpen(true);
            }}
          >
            <Archive className="h-4 w-4" />
            Archive
          </DropdownMenuItem> */}

          {/* <DropdownMenuSeparator /> */}

          <DropdownMenuItem
            className="text-red-600 flex items-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <TriangleAlert className="h-8 w-8 text-red-500" />
            </div>

            <AlertDialogTitle className="mt-6 text-2xl font-bold">
              Archive Product
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">
              <strong>{productName}</strong>, this product will be archived and will no longer be visible to
              customers. You can restore it later from the archived products
              list.
            </AlertDialogDescription>
          </div>

          <div className="flex gap-3 border-t bg-muted/20 px-6 py-5">
            <AlertDialogCancel className="bg-muted hover:bg-gray-200 rounded-full flex-1 border-none">
              <div>Cancel</div>
            </AlertDialogCancel>

            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-full flex-1 border-none">
              <div onClick={handleArchive} className="">
                {loading ? "Archiving..." : "Archive"}
              </div>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog> */}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>

            <AlertDialogTitle className="mt-6 text-2xl font-bold">Delete Product</AlertDialogTitle>

            <AlertDialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete this product, <strong>{productName}</strong>? This action cannot
              be undone.
            </AlertDialogDescription>
          </div>

          <div className="flex gap-3 border-t bg-muted/20 px-6 py-5">
            <AlertDialogCancel className="bg-muted hover:bg-gray-200 rounded-full flex-1 border-none">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 rounded-full flex-1 border-none"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
