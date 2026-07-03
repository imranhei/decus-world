"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InfoTooltipProps = {
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
};

export function InfoTooltip({
  children,
  className,
  iconClassName,
}: InfoTooltipProps) {
  return (
    <>
      {/* Desktop */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button
              type="button"
              className={`hidden sm:inline-flex h-4 w-4 items-center justify-center text-muted-foreground ${className ?? ""}`}
            >
              <Info className={`h-3.5 w-3.5 ${iconClassName ?? ""}`} />
            </button>
          </TooltipTrigger>

          <TooltipContent className="max-w-xs text-left flex flex-col text-xs">
            {children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Mobile */}
      <Popover>
        <PopoverTrigger>
          <Button
            variant="ghost"
            size="icon"
            className={`inline-flex size-4 p-0 sm:hidden ${className ?? ""}`}
          >
            <Info
              className={`h-3.5 w-3.5 text-muted-foreground ${iconClassName ?? ""}`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent side="top" className="max-w-xs text-xs text-left bg-black/90 text-white">
          {children}
        </PopoverContent>
      </Popover>
    </>
  );
}
