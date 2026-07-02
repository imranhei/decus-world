"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/server/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => logoutAction())}
      className={cn(className, "h-8 rounded-full px-4 text-xs")}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}