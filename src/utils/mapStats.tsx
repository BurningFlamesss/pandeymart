export function mapStatsToUI(stats: {
    totalRevenue: number
    previousRevenue: number
    activeOrders: number
    pendingOrders: number
    totalProducts: number
    lowStockProducts: number
    activeUsers: number
    suspendedUsers: number
}) {
    const revenueChange =
        stats.previousRevenue === 0
            ? 0
            : ((stats.totalRevenue - stats.previousRevenue) /
                stats.previousRevenue) *
            100

    return [
        {
            label: "Total Revenue",
            value: `Rs. ${stats.totalRevenue.toFixed(2)}`,
            change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
            positive: revenueChange >= 0,
        },
        {
            label: "Active Orders",
            value: stats.activeOrders.toString(),
            change: `${stats.pendingOrders} pending`,
            positive: null,
        },
        {
            label: "Products",
            value: stats.totalProducts.toString(),
            change: `${stats.lowStockProducts} low stock`,
            positive:
                stats.lowStockProducts === 0 ? true : false,
        },
        {
            label: "Active Users",
            value: stats.activeUsers.toString(),
            change: `${stats.suspendedUsers} suspended`,
            positive: null,
        },
    ]
}