"use client";

import { useState, useTransition } from "react";

import { submitReviewAction } from "@/server/actions/review-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ReviewForm({ productId }: { productId: string }) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");

    const values = {
      productId,
      rating,
      comment: formData.get("comment"),
    };

    startTransition(async () => {
      const result = await submitReviewAction(values);
      setMessage(result.message);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-xl border p-5">
      <h3 className="font-semibold">Write a Review</h3>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <div className="space-y-2">
        <Label>Rating</Label>
        <select
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Bad</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Comment</Label>
        <textarea
          name="comment"
          className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Share your experience..."
        />
      </div>

      <Button disabled={isPending} type="submit">
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}