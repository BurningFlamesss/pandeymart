import { createFileRoute } from '@tanstack/react-router'
import { getAllProducts } from '@/server/functions/getProducts'
import HomeBanner from '@/components/layout/home/HomeBanner'
import Products from '@/components/layout/home/Products'
import SectionStarter from '@/components/shared/SectionStarter'
import HomeAd from '@/components/layout/home/HomeAd'
import WhyChooseUs from '@/components/layout/home/WhyChooseUs'

export const Route = createFileRoute('/product/')({
  component: RouteComponent,
  async loader() {
    return await getAllProducts()
  }
})

function RouteComponent() {
  const { all, featured, mostOrdered } = Route.useLoaderData()


  return (
    <>
      <HomeBanner />
      <Products products={featured} >
        <SectionStarter title="Featured Products" src="/pandeymart.png" description="Discover the greatest products" />
      </Products>
      <HomeAd />
      <Products products={mostOrdered} >
        <SectionStarter title="Top Selling Products" src="/pandeymart.png" description="Find the best selling products" />
      </Products>
      <WhyChooseUs></WhyChooseUs>
      <Products products={all} >
        <SectionStarter title="All Products" src="/pandeymart.png" description="Shop all our products" />
      </Products>
      {/* <Reviews></Reviews> */}
      {/* <Offers></Offers> */}
    </>
  )
}
