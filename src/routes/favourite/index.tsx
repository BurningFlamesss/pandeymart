import { useFavourite } from '@/hooks/use-favourite'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favourite/')({
  component: RouteComponent,
})

const getProducts = () => {
  return 
}

function RouteComponent() {
  const { favourite, addToFavourite, removeFromFavourite, clearFavourite } = useFavourite()
  const products = getProducts()

  return (

  )
}
