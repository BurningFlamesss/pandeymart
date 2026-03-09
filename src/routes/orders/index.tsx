import { useState } from "react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { requireAuth } from "@/middleware/auth"
import { cancelOrder, getMyOrders, requestRefund, submitReview } from "@/server/functions/getOrders"
import { parseCustomizations } from "@/utils/parseCustomization"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/orders/")({
    async beforeLoad() {
        await requireAuth()
    },
    component: RouteComponent,
})

type Order = Awaited<ReturnType<typeof getMyOrders>>[number]

const ORDER_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const

const STEP_LABEL: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
}

const PAYMENT_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
    PENDING: { label: "Awaiting Payment", dot: "bg-amber-400", text: "text-amber-700" },
    PAID: { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700" },
    FAILED: { label: "Payment Failed", dot: "bg-red-500", text: "text-red-600" },
    REFUNDED: { label: "Refunded", dot: "bg-blue-400", text: "text-blue-700" },
}

function SellerNoteIcon() {
    return (
        <svg
            className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
        </svg>
    )
}

function OrderStatusStepper({ status }: { status: string }) {
    const isCancelled = status === "CANCELLED"
    const currentIndex = isCancelled
        ? -1
        : ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number])

    return (
        <div className="flex items-center">
            {ORDER_STEPS.map((step, index) => {
                const isCompleted = !isCancelled && index <= currentIndex
                const isCurrent = !isCancelled && index === currentIndex
                const isLast = index === ORDER_STEPS.length - 1
                const showCancelledHere = isCancelled && index === 0

                return (
                    <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${showCancelledHere
                                    ? "bg-red-400"
                                    : isCancelled
                                        ? "bg-stone-200"
                                        : isCompleted
                                            ? isCurrent
                                                ? "bg-stone-800 ring-2 ring-stone-300 ring-offset-1"
                                                : "bg-stone-700"
                                            : "bg-stone-200"
                                    }`}
                            />
                            <span
                                className={`text-[9px] uppercase tracking-wider whitespace-nowrap font-medium ${showCancelledHere
                                    ? "text-red-400"
                                    : isCancelled
                                        ? "text-stone-300"
                                        : isCompleted
                                            ? "text-stone-600"
                                            : "text-stone-300"
                                    }`}
                            >
                                {showCancelledHere ? "Cancelled" : STEP_LABEL[step]}
                            </span>
                        </div>
                        {!isLast && (
                            <div
                                className={`w-10 h-px mb-4 mx-1 ${!isCancelled && index < currentIndex
                                    ? "bg-stone-700"
                                    : "bg-stone-200"
                                    }`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function StarRating({
    value,
    onChange,
    readonly = false,
}: {
    value: number
    onChange?: (value: number) => void
    readonly?: boolean
}) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star, index) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                    className={`text-base leading-none transition-transform ${readonly ? "cursor-default" : "cursor-pointer"} ${star <= (hovered || value) ? "scale-110" : ""}`}
                >
                    <Star
                    key={`${star}-${index}`}
                    className={cn(
                        readonly ? "h-3 w-3" : "h-5 w-5",
                        star <= (hovered || value)
                            ? "fill-[#FAA016] text-[#FAA016]"
                            : "fill-gray-200 text-gray-200"
                    )}
                />
                </button>
            ))}
        </div>
    )
}

function ReviewDialog({
    open,
    onClose,
    productId,
    productName,
    existingRating,
    existingReview,
}: {
    open: boolean
    onClose: () => void
    productId: string
    productName: string
    existingRating?: number
    existingReview?: string
}) {
    const queryClient = useQueryClient()
    const [rating, setRating] = useState(existingRating ?? 0)
    const [review, setReview] = useState(existingReview ?? "")

    const mutation = useMutation({
        mutationFn: () =>
            submitReview({ data: { productId, rating, review: review || undefined } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-orders"] })
            toast.success("Review submitted")
            onClose()
        },
        onError: () => toast.error("Failed to submit review"),
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-sm font-semibold text-stone-800">
                        {existingRating ? "Edit review" : "Leave a review"} &middot; {productName}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-5 pt-1">
                    <div>
                        <p className="text-[10px] text-stone-400 mb-2 uppercase tracking-widest">Rating</p>
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div>
                        <p className="text-[10px] text-stone-400 mb-2 uppercase tracking-widest">
                            Review <span className="normal-case font-normal">(optional)</span>
                        </p>
                        <Textarea
                            rows={3}
                            placeholder="Share your experience..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="resize-none text-sm"
                        />
                    </div>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={rating === 0 || mutation.isPending}
                        className="w-full"
                        size="sm"
                    >
                        {mutation.isPending ? "Submitting…" : existingRating ? "Update Review" : "Submit Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function RefundDialog({
    open,
    onClose,
    orderId,
    orderNumber,
}: {
    open: boolean
    onClose: () => void
    orderId: string
    orderNumber: string
}) {
    const queryClient = useQueryClient()
    const [reason, setReason] = useState("")

    const mutation = useMutation({
        mutationFn: () => requestRefund({ data: { orderId, reason } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-orders"] })
            toast.success("Refund request submitted")
            onClose()
            setReason("")
        },
        onError: () => toast.error("Failed to submit refund request"),
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-sm font-semibold text-stone-800">
                        Request Refund &middot; <span className="font-mono text-stone-400">#{orderNumber}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-5 pt-1">
                    <div>
                        <p className="text-[10px] text-stone-400 mb-2 uppercase tracking-widest">Reason</p>
                        <Textarea
                            rows={4}
                            placeholder="Please describe the issue in detail..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="resize-none text-sm"
                        />
                        {reason.length > 0 && reason.length < 10 && (
                            <p className="mt-1.5 text-[11px] text-red-400">At least 10 characters required</p>
                        )}
                    </div>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={reason.length < 10 || mutation.isPending}
                        variant="destructive"
                        className="w-full"
                        size="sm"
                    >
                        {mutation.isPending ? "Submitting…" : "Submit Request"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function OrderCard({ order }: { order: Order }) {
    const queryClient = useQueryClient()
    const { addToCart } = useCart()

    const [expandedItems, setExpandedItems] = useState(false)
    const [reviewTarget, setReviewTarget] = useState<{
        productId: string
        productName: string
        existingRating?: number
        existingReview?: string
    } | null>(null)
    const [refundOpen, setRefundOpen] = useState(false)
    const [cancelOpen, setCancelOpen] = useState(false)

    const cancelMutation = useMutation({
        mutationFn: () => cancelOrder({ data: { orderId: order.orderId } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-orders"] })
            toast.success("Order cancelled")
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

    const shortId = order.orderId.split("-")[0].toUpperCase()
    const payment = PAYMENT_CONFIG[order.paymentStatus] ?? PAYMENT_CONFIG.PENDING
    const canCancel = order.status === "PENDING"
    const canRefund = order.status === "DELIVERED" && order.paymentStatus === "PAID"
    const isDelivered = order.status === "DELIVERED"
    const visibleItems = expandedItems ? order.items : order.items.slice(0, 2)
    const hiddenCount = order.items.length - 2

    function handleReorder() {
        order.items.forEach((item) => {
            const customizations = parseCustomizations(item.customizations)
            addToCart({
                cartItemId: `${item.productId}-${Date.now()}-${Math.random()}`,
                productId: item.productId,
                basePrice: item.productPrice,
                quantity: item.quantity,
                customizations: customizations.length ? customizations : undefined,
            })
        })
        toast.success("Items added to cart")
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-50">
                    <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs text-stone-400 tracking-wide">#{shortId}</span>
                            <span className="text-stone-200 select-none">·</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${payment.dot}`} />
                                <span className={`text-[10px] font-medium ${payment.text}`}>
                                    {payment.label}
                                </span>
                            </div>
                        </div>
                        <span className="text-[11px] text-stone-400">{orderDate}</span>
                    </div>
                    <OrderStatusStepper status={order.status} />
                </div>

                {order.sellerNotes && (
                    <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100 flex items-start gap-2.5">
                        <SellerNoteIcon />
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-0.5">
                                Seller note
                            </p>
                            <p className="text-xs text-amber-800 leading-relaxed">{order.sellerNotes}</p>
                        </div>
                    </div>
                )}

                <div className="px-5 pt-3 pb-1 divide-y divide-stone-50">
                    {visibleItems.map((item) => {
                        const customizations = parseCustomizations(item.customizations)
                        const existingRating = item.product?.ratings?.[0]
                        const image = item.product?.productImages?.[0]?.url

                        return (
                            <div key={item.orderItemId} className="flex items-center gap-3 py-2.5 first:pt-0">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={item.productName}
                                        className="w-11 h-11 rounded-lg object-cover bg-stone-100 shrink-0"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-lg bg-stone-100 shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-stone-800">
                                            {item.productName}
                                        </p>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-semibold text-stone-700 tabular-nums">
                                                Rs. {(item.productPrice * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-[10px] text-stone-400 mt-0.5">for {item.quantity} {item.product?.unit ?? "units"}</p>
                                        </div>
                                    </div>

                                    {customizations.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {customizations.map((group) => (
                                                <span
                                                    key={group.title}
                                                    className="text-[10px] bg-stone-50 border border-stone-100 text-stone-500 px-1.5 py-0.5 rounded-md"
                                                >
                                                    {group.title}: {group.options.map((option) => option.label).join(", ")}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {isDelivered && (
                                        <button
                                            onClick={() =>
                                                setReviewTarget({
                                                    productId: item.productId,
                                                    productName: item.productName,
                                                    existingRating: existingRating?.rating,
                                                    existingReview: existingRating?.review ?? undefined,
                                                })
                                            }
                                            className="flex items-center gap-1.5 group"
                                        >
                                            {existingRating ? (
                                                <>
                                                    <StarRating value={existingRating.rating} readonly />
                                                    <span className="text-[10px] text-stone-400 group-hover:text-stone-700 transition-colors underline underline-offset-2 decoration-stone-300 cursor-pointer">
                                                        Edit
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-stone-400 group-hover:text-stone-700 transition-colors underline underline-offset-2 decoration-stone-300 cursor-pointer">
                                                    Leave a review
                                                </span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {order.items.length > 2 && (
                    <div className="px-5 pb-3">
                        <button
                            onClick={() => setExpandedItems((prev) => !prev)}
                            className="text-[10px] text-stone-400 group-hover:text-stone-700 transition-colors underline underline-offset-2 decoration-stone-300 cursor-pointer"                        >
                            {expandedItems ? "Show less" : `+${hiddenCount} more item${hiddenCount > 1 ? "s" : ""}`}
                        </button>
                    </div>
                )}

                <div className="px-5 py-3.5 border-t border-stone-50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Total</p>
                        <p className="text-sm font-semibold text-stone-800 tabular-nums">
                            Rs. {order.total.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleReorder} className="text-xs h-7 px-3">
                            Reorder
                        </Button>
                        {canCancel && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCancelOpen(true)}
                                className="text-xs h-7 px-3 text-red-400 border-red-100 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                            >
                                Cancel
                            </Button>
                        )}
                        {canRefund && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setRefundOpen(true)}
                                className="text-xs h-7 px-3"
                            >
                                Refund
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {reviewTarget && (
                <ReviewDialog
                    open
                    onClose={() => setReviewTarget(null)}
                    productId={reviewTarget.productId}
                    productName={reviewTarget.productName}
                    existingRating={reviewTarget.existingRating}
                    existingReview={reviewTarget.existingReview}
                />
            )}

            <RefundDialog
                open={refundOpen}
                onClose={() => setRefundOpen(false)}
                orderId={order.orderId}
                orderNumber={shortId}
            />

            <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel order #{shortId}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This order will be permanently cancelled and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => cancelMutation.mutate()}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function RouteComponent() {
    const { data: orders = [], isPending, isError } = useQuery({
        queryKey: ["my-orders"],
        queryFn: () => getMyOrders(),
    })

    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto px-6 py-10 lg:py-16">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Orders</h1>
                    <p className="text-stone-400 text-sm mt-1">
                        {isPending
                            ? "Loading…"
                            : orders.length === 0
                                ? "No orders yet"
                                : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {isPending && (
                    <div className="space-y-3">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-44 rounded-2xl bg-stone-100 animate-pulse" />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="text-center py-20">
                        <p className="text-stone-400 text-sm">Could not load orders. Please refresh.</p>
                    </div>
                )}

                {!isPending && !isError && orders.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                            </svg>
                        </div>
                        <p className="text-stone-600 font-medium mb-1 text-sm">No orders yet</p>
                        <p className="text-stone-400 text-xs mb-6">Your orders will appear here once you shop.</p>
                        <Link to="/product">
                            <Button variant="outline" size="sm" className="text-xs">Browse Products</Button>
                        </Link>
                    </div>
                )}

                {!isPending && !isError && orders.length > 0 && (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <OrderCard key={order.orderId} order={order} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}