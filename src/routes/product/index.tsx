import { createFileRoute } from '@tanstack/react-router'
import Home from '@/components/container/Home'

export const Route = createFileRoute('/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Home />
}
