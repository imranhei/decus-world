"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()} className="h-8 rounded-full px-4 text-xs">
      <ArrowLeft className="size-3.5" />
      Go Back
    </Button>
  );
}