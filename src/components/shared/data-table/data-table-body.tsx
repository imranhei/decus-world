import { cn } from "@/lib/utils";

type DataTableBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export function DataTableBody({
  children,
  className,
}: DataTableBodyProps) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        className,
      )}
    >
      {children}
    </tbody>
  );
}