import { cn } from "@/lib/utils";

type Column = {
  title: React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
};

type DataTableHeaderProps = {
  columns: Column[];
  className?: string;
};

export function DataTableHeader({
  columns,
  className,
}: DataTableHeaderProps) {
  return (
    <thead className={cn("border-b bg-muted", className)}>
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            style={{
              width: column.width,
            }}
            className={cn(
              "px-3 py-3 font-semibold whitespace-nowrap",
              column.align === "center" && "text-center",
              column.align === "right"
                ? "text-right"
                : "text-left",
            )}
          >
            {column.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}