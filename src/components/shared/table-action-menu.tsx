"use client";

import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TableActionMenuProps = {
  viewHref?: string;
  children?: React.ReactNode;
};

export function TableActionMenu({ viewHref, children }: TableActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {viewHref ? (
          <DropdownMenuItem>
            <Link href={viewHref} className="flex items-center w-full">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
        ) : null}

        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}