import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useFavourite } from '@/hooks/use-favourite'
import { getProducts } from '@/server/functions/getProducts'
import Products from '@/components/layout/home/Products'
import SectionStarter from '@/components/shared/SectionStarter'

export const Route = createFileRoute('/favourite/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { favourite, addToFavourite, removeFromFavourite, clearFavourite } = useFavourite()

  const { data, isError, isPending } = useQuery({
    queryKey: ['favourite-products', favourite],
    queryFn: () => {
      if (favourite.length === 0) return []

      return getProducts({ data: favourite })
    },
  })

  if (isPending) {
    return (
      <div className='h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center'>
        Favourite Products are Loading...
      </div>
    )
  }

  if (isError) {
    return (
      <div className='h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center'>
        An Error Occured
      </div>
    )
  }


  if (data.length === 0) {
    return (
      <div className='h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center'>
        No Favourites yet
      </div>
    )
  }

  return (
    <Products products={data} >
      <SectionStarter title="Favourite Products" src="/sectionstarter/skincare.png" description="Fresh and Fabulous From Herbs to Face" />
    </Products>
  )
}
