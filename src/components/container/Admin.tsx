import DataManagement from "../layout/admin/DataManagement"
import { StatsBar } from "../layout/admin/StatsBar"

const stats = [{
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

function Admin() {
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

                <StatsBar stats={stats}></StatsBar>
                <DataManagement />
            </main>
        </div>
    )
}

export default Admin