import { createFileRoute } from '@tanstack/react-router'
import Admin from '@/components/container/Admin'
import { requireAdminAccess } from '@/middleware/auth'
import { getAdminPanelOrdersData, getAdminPanelProductsData, getAdminPanelStatsData, getAdminPanelUsersData } from '@/server/functions/AdminFunctions'

export const Route = createFileRoute('/admin/')({
  async beforeLoad() {
    await requireAdminAccess()
  },
  async loader() {
    const [stats, products, orders, users] = await Promise.all([
      await getAdminPanelStatsData(),
      await getAdminPanelProductsData(),
      await getAdminPanelOrdersData(),
      await getAdminPanelUsersData()
    ]);
    return {
      stats,
      products,
      orders,
      users
    }
  },
  component: RouteComponent,
})



function RouteComponent() {
  const { stats, products, orders, users } = Route.useLoaderData()
  return (
    <>
      <Admin stats={stats} products={products} orders={orders} users={users} />
    </>
  )
}

