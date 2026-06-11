import Link from "next/link";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function createHref(targetPage: number) {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", String(targetPage));

    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button variant="outline" disabled={page <= 1}>
        <Link href={createHref(page - 1)}>Previous</Link>
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button variant="outline" disabled={page >= totalPages}>
        <Link href={createHref(page + 1)}>Next</Link>
      </Button>
    </div>
  );
}