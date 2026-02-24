import { createFileRoute } from '@tanstack/react-router'
import Admin from '@/components/container/Admin'
import { requireAdminAccess } from '@/middleware/auth'
import { getAdminData } from '@/server/functions/AdminFunctions'

export const Route = createFileRoute('/admin/')({
  async beforeLoad() {
    await requireAdminAccess()
  },
  async loader() {
    return await getAdminData()
  },
  component: RouteComponent,
})



function RouteComponent() {
  const stats = Route.useLoaderData()
  console.log("Admin stats:", stats)
  return (
    <>
      <Admin stats={stats} />
    </>
  )
}

