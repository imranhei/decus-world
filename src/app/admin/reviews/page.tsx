import Link from "next/link";

import { getAdminReviews } from "@/server/queries/admin-review-queries";
import {
  approveReviewAction,
  rejectReviewAction,
} from "@/server/actions/admin-review-actions";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="mt-1 text-muted-foreground">
          Approve or reject customer product reviews.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} />
                  <Badge variant={review.isApproved ? "default" : "secondary"}>
                    {review.isApproved ? "APPROVED" : "PENDING"}
                  </Badge>
                </div>

                <p className="mt-3 font-medium">
                  {review.user.name || "Customer"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {review.user.email}
                </p>

                <Link
                  href={`/products/${review.product.slug}`}
                  className="mt-2 block text-sm font-medium underline"
                >
                  {review.product.name}
                </Link>
              </div>

              <div className="flex gap-2">
                {!review.isApproved ? (
                  <form
                    action={async () => {
                      "use server";
                      await approveReviewAction(review.id);
                    }}
                  >
                    <Button size="sm" className="h-8 rounded-full px-6 text-xs">
                      <Check /> Approve
                    </Button>
                  </form>
                ) : null}

                <form
                  action={async () => {
                    "use server";
                    await rejectReviewAction(review.id);
                  }}
                >
                  <Button size="sm" variant="destructive" className="h-8 rounded-full px-6 text-xs flex items-center gap-2">
                    <Trash2/> Delete
                  </Button>
                </form>
              </div>
            </div>

            {review.comment ? (
              <p className="mt-4 text-sm text-muted-foreground">
                {review.comment}
              </p>
            ) : null}
          </div>
        ))}

        {!reviews.length ? (
          <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
            No reviews found.
          </div>
        ) : null}
      </div>
    </div>
  );
}