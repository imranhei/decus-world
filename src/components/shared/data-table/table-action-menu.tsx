"use client";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  children: React.ReactNode;
};

export function TableActionMenu({ children }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className="h-8 w-8 md:rounded-full rounded-lg border flex items-center justify-center cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-44"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}