import { createFileRoute } from '@tanstack/react-router'
import { getAllProducts } from '@/server/functions/getProducts'
import HomeBanner from '@/components/layout/home/HomeBanner'
import Products from '@/components/layout/home/Products'
import SectionStarter from '@/components/shared/SectionStarter'
import Offers from '@/components/layout/home/HomeMarketing'
import HomeAd from '@/components/layout/home/HomeAd'
import Reviews from '@/components/layout/home/Reviews'
import WhyChooseUs from '@/components/layout/home/WhyChooseUs'
import { products } from '@/config/mockProducts'

export const Route = createFileRoute('/product/')({
  component: RouteComponent,
  async loader() {
    return await getAllProducts()
  }
})

function RouteComponent() {
  const databaseProducts = Route.useLoaderData()


  return (
    <>
      <HomeBanner />
      <Products products={databaseProducts.length > 0 ? databaseProducts.slice(0, 6) : products.slice(0, 66)} >
        <SectionStarter title="Top Selling Products" src="/sectionstarter/skincare.png" description="Fresh and Fabulous From Herbs to Face" />
      </Products>
      <Offers></Offers>
      <Products products={databaseProducts.length > 6 ? databaseProducts.slice(6) : products.slice(6)} >
        <SectionStarter title="Top Category products" src="/sectionstarter/spicy.png" description="Stocking up on goodness, one aisle at a time." />
      </Products>
      <HomeAd />
      <Reviews></Reviews>
      <WhyChooseUs></WhyChooseUs>
    </>
  )
}
