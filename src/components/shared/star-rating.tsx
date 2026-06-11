import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index < rating;

        return (
          <Star
            key={index}
            className={cn(
              size === "sm" ? "h-4 w-4" : "h-5 w-5",
              active ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        );
      })}
    </div>
  );
}