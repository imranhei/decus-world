import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-zinc-950" />

        <div className="text-center">
          <h2 className="font-heading text-2xl font-semibold">Decus World</h2>

          <div className="flex gap-2">
            {/* <Loader2 className="h-10 w-10 animate-spin" /> */}
            <p className="mt-1 text-sm text-muted-foreground">
              Preparing your shopping experience...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
