import { cn } from "@/lib/utils";

type DataTableProps = {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
};

export function DataTable({
  children,
  className,
  minWidth = "900px",
}: DataTableProps) {
  return (
    <div
      className={cn(
        "hidden rounded-xl overflow-hidden border bg-background md:block",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          style={{ minWidth }}
        >
          {children}
        </table>
      </div>
    </div>
  );
}