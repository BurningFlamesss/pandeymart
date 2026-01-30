import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/middleware/auth'

export const Route = createFileRoute('/checkout/')({
  async beforeLoad() {
    await requireAuth()
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/checkout/"!</div>
}
