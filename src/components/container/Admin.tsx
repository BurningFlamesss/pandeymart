import DataManagement from "../layout/admin/DataManagement"
import { StatsBar } from "../layout/admin/StatsBar"
import type { AdminPanelOrder, AdminPanelProduct, AdminPanelUser } from "@/server/functions/AdminFunctions"
import { mapStatsToUI } from "@/utils/mapStats"

type AdminStats = {
    totalRevenue: number
    previousRevenue: number
    activeOrders: number
    pendingOrders: number
    totalProducts: number
    lowStockProducts: number
    activeUsers: number
    suspendedUsers: number
}

const dummyStats = [{
    label: "Total Revenue",
    value: "Rs. 45099.89",
    change: "+12%",
    positive: true,
}, {
    label: "Active Orders",
    value: "3",
    change: "2 pending",
    positive: null,
}, {
    label: "Products",
    value: "6",
    change: "2 low stock",
    positive: false,
}, {
    label: "Active Users",
    value: "4",
    change: "1 suspended",
    positive: null,
}]

function Admin({ stats, products, orders, users }: { stats?: AdminStats, products: Array<AdminPanelProduct>, orders: Array<AdminPanelOrder>, users: Array<AdminPanelUser> }) {
    const mappedStats = stats ? mapStatsToUI(stats) : dummyStats;

    return (
        <div className='min-h-screen bg-gray-50 text-gray-900'>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-xl font-semi-bold">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-700 mt-0.5">
                        Manage orders, inventory, and customers
                    </p>
                </div>

                <StatsBar stats={mappedStats}></StatsBar>
                <DataManagement products={products} orders={orders} users={users} />
            </main>
        </div>
    )
}

export default Admin