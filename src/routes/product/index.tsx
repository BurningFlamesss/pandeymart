import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import type { Product } from '@/types/Product'
import { getAllProducts } from '@/server/functions/getProducts'
import HomeBanner from '@/components/layout/home/HomeBanner'
import Products from '@/components/layout/home/Products'
import SectionStarter from '@/components/shared/SectionStarter'
import HomeAd from '@/components/layout/home/HomeAd'
import WhyChooseUs from '@/components/layout/home/WhyChooseUs'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/product/')({
  component: RouteComponent,
  loader: () => ({
    itemsPromise: getAllProducts()
  })
})

export type ItemsPromise = Promise<{
  all: Array<Product>;
  mostOrdered: Array<Product>;
  featured: Array<Product>;
}>


function RouteComponent() {
  const { itemsPromise } = Route.useLoaderData();

  return (
    <>
      <HomeBanner />
      <Suspense fallback={<ProductPlaceholders />}>
        <FeaturedProducts promise={itemsPromise} />
      </Suspense>
      <HomeAd />
      <Suspense fallback={<ProductPlaceholders />}>
        <TopSellingProducts promise={itemsPromise} />
      </Suspense>
      <WhyChooseUs />
      <Suspense fallback={<ProductPlaceholders />}>
        <AllProducts promise={itemsPromise} />
      </Suspense>
      {/* <Reviews></Reviews> */}
      {/* <Offers></Offers> */}
    </>
  )
}

function AllProducts({ promise }: { promise: ItemsPromise }) {
  const { all } = use(promise)

  return (
    <Products products={all} >
      <SectionStarter title="All Products" src="/pandeymart.png" description="Shop all our products" />
    </Products>
  )
}

function TopSellingProducts({ promise }: { promise: ItemsPromise }) {
  const { mostOrdered } = use(promise)

  return (
    <Products products={mostOrdered} >
      <SectionStarter title="Top Selling Products" src="/pandeymart.png" description="Find the best selling products" />
    </Products>
  )
}

function FeaturedProducts({ promise }: { promise: ItemsPromise }) {
  const { featured } = use(promise)

  return (
    <Products products={featured} >
      <SectionStarter title="Featured Products" src="/pandeymart.png" description="Discover the greatest products" />
    </Products>
  )
}

export const ProductPlaceholder = () => {
    return (
        <div className="flex flex-col w-full border border-gray-200 rounded-lg bg-white h-full">
            <div className="relative bg-zinc-100 h-64 w-full overflow-hidden rounded-t-lg shrink-0">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-5 flex flex-col grow">
                <Skeleton className="h-14 w-3/4 mb-3" />
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="flex gap-3 mb-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-8 w-full mb-3" />
                <Skeleton className="h-10 w-full mt-auto" />
            </div>
        </div>
    );
};

function ProductPlaceholders() {
  return (
    <div className="flex justify-center items-center w-full px-4 py-8 lg:py-16">
      <div className="w-full max-w-300">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((product) => (
            <ProductPlaceholder
              key={`product-${product}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}