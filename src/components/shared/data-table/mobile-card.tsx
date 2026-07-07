import { cn } from "@/lib/utils";

type MobileCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function MobileCard({
  children,
  className,
}: MobileCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-background p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}