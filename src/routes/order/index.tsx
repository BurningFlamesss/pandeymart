import { createFileRoute } from '@tanstack/react-router'
import { getOrders } from '@/server/functions/getOrders'

export const Route = createFileRoute('/order/')({
  async loader() {
    const orders = await getOrders()
    return orders
  },
  component: RouteComponent,
})

function RouteComponent() {
  const orders = Route.useLoaderData()

  return (
    <>
      
    </>
  )
}
