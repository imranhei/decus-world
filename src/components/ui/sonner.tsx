"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-600" />,
        info: <InfoIcon className="size-4 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-600" />,
        error: <OctagonXIcon className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border shadow-lg data-[type=success]:!border-green-200 data-[type=success]:!bg-green-50 data-[type=success]:!text-green-900 data-[type=error]:!border-red-200 data-[type=error]:!bg-red-50 data-[type=error]:!text-red-900 data-[type=warning]:!border-yellow-200 data-[type=warning]:!bg-yellow-50 data-[type=warning]:!text-yellow-900 data-[type=info]:!border-blue-200 data-[type=info]:!bg-blue-50 data-[type=info]:!text-blue-900",
          title: "font-semibold",
          description: "text-sm opacity-80",
          actionButton: "bg-zinc-950 text-white",
          cancelButton: "bg-muted text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
