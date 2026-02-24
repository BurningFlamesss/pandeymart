import { createFileRoute } from '@tanstack/react-router'
import Admin from '@/components/container/Admin'
import { requireAdminAccess } from '@/middleware/auth'
import { getAdminPanelProductsData, getAdminPanelStatsData } from '@/server/functions/AdminFunctions'

export const Route = createFileRoute('/admin/')({
  async beforeLoad() {
    await requireAdminAccess()
  },
  async loader() {
    const stats = await getAdminPanelStatsData();
    const products = await getAdminPanelProductsData()
    return {
      stats,
      products
    }
  },
  component: RouteComponent,
})



function RouteComponent() {
  const { stats, products } = Route.useLoaderData()
  console.log("Admin stats:", stats)
  return (
    <>
      <Admin stats={stats} products={products} />
    </>
  )
}

