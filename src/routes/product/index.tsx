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
        <SectionStarter title="Featured Products" src="/sectionstarter/spicy.png" description="Shop the latest and greatest products" />
      </Products>
      <HomeAd />
      <Products products={mostOrdered} >
        <SectionStarter title="Top Selling Products" src="/sectionstarter/skincare.png" description="Find your new favorite products" />
      </Products>
      <WhyChooseUs></WhyChooseUs>
      <Products products={all} >
        <SectionStarter title="All Products" src="/sectionstarter/skincare.png" description="Shop all our products" />
      </Products>
      {/* <Reviews></Reviews> */}
      {/* <Offers></Offers> */}
    </>
  )
}
