import { createFileRoute } from '@tanstack/react-router'
import Admin from '@/components/container/Admin'
import { requireAdminAccess } from '@/middleware/auth'

export const Route = createFileRoute('/admin/')({
  async beforeLoad() {
    await requireAdminAccess()
  },
  async loader() {
    
  },
  component: RouteComponent,
})



function RouteComponent() {
  return (
    <>
      <Admin />
    </>
  )
}

