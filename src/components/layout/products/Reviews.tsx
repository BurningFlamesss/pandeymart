import { Star } from "lucide-react";
import type { reviewType as Review } from "@/server/functions/getProducts";
import { cn } from "@/lib/utils";
import { format } from "@/utils/format";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
    const starSize = size === "lg" ? "h-5 w-5" : "h-3 w-3";
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    className={cn(
                        starSize,
                        index < rating
                            ? "fill-[#FAA016] text-[#FAA016]"
                            : "fill-gray-200 text-gray-200"
                    )}
                />
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const initials = review.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
            <div className="shrink-0">
                {review.user.image ? (
                    <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover scale-120 border border-gray-200"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#FAA016]/10 border border-[#FAA016]/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#FAA016]">{initials}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{review.user.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{format.dateD(review.createdAt)}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.review}</p>
            </div>
        </div>
    );
}

function RatingSummary({ reviews }: { reviews: Array<Review> }) {
    const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const counts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((review) => review.rating === star).length,
    }));

    return (
        <div className="flex gap-8 p-5 bg-gray-50 rounded-lg mb-5">
            <div className="flex flex-col items-center justify-center shrink-0">
                <span className="text-4xl font-bold text-gray-900">{avg.toFixed(1)}</span>
                <StarRating rating={Math.round(avg)} size="lg" />
                <span className="text-xs text-gray-500 mt-1">{reviews.length} reviews</span>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 justify-center">
                {counts.map(({ star, count }) => {
                    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-3">{star}</span>
                            <Star className="h-3 w-3 fill-[#FAA016] text-[#FAA016] shrink-0" />
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#FAA016] rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function ReviewsSection({ reviews }: { reviews: Array<Review> }) {
    if (!reviews?.length) {
        return (
            <div className="text-center py-8 text-gray-400 text-sm">
                No reviews yet. Be the first to review!
            </div>
        );
    }

    return (
        <div>
            <RatingSummary reviews={reviews} />
            <div>
                {reviews.map((review) => (
                    <ReviewCard key={review.ratingId} review={review} />
                ))}
            </div>
        </div>
    );
}