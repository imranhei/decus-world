import { cn } from "@/lib/utils";

type DataTableMobileProps = {
  children: React.ReactNode;
  className?: string;
};

export function DataTableMobile({
  children,
  className,
}: DataTableMobileProps) {
  return (
    <div
      className={cn(
        "space-y-3 md:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}