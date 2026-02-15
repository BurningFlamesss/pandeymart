import { createFileRoute } from '@tanstack/react-router'
import Admin from '@/components/container/Admin'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})



function RouteComponent() {
  return (
    <>
      <Admin />
    </>
  )
}

