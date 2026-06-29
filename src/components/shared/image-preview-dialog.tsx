"use client";

import { ImageIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ImagePreviewDialogProps = {
  image: StaticImageData | string;
  title?: string;
  alt?: string;
  buttonText?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
};

export function ImagePreviewDialog({
  image,
  title = "Preview Image",
  alt = "Preview image",
  buttonText = "Preview Image",
  buttonClassName,
  icon,
}: ImagePreviewDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        {icon || <ImageIcon className="mr-2 h-4 w-4" />}
        {buttonText}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl! p-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="relative overflow-hidden rounded-lg">
            <Image src={image} alt={alt} className="h-auto w-full" priority />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
