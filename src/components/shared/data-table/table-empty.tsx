type TableEmptyProps = {
  title?: string;
  description?: string;
  colSpan?: number;
};

export function TableEmpty({
  title = "No data found",
  description = "There are no records to display.",
  colSpan = 100,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </td>
    </tr>
  );
}