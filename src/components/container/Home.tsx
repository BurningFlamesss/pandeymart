import HomeAd from '../layout/home/HomeAd'
import HomeBanner from '../layout/home/HomeBanner'
import Offers from '../layout/home/HomeMarketing'
import Products from '../layout/home/Products'
import Reviews from '../layout/home/Reviews'
import WhyChooseUs from '../layout/home/WhyChooseUs'
import SectionStarter from '../shared/SectionStarter'
import { getAllProducts } from '@/server/functions/getProducts'

async function Home() {
    const databaseProducts = await getAllProducts()
    return (
        <>
            <HomeBanner />
            <Products products={databaseProducts.slice(0, 6)} >
                <SectionStarter title="Top Selling Products" src="/sectionstarter/skincare.png" description="Fresh and Fabulous From Herbs to Face" />
            </Products>
            <Offers></Offers>
            <Products products={databaseProducts.slice(6)} >
                <SectionStarter title="Top Category products" src="/sectionstarter/spicy.png" description="Stocking up on goodness, one aisle at a time." />
            </Products>
            <HomeAd />
            <Reviews></Reviews>
            <WhyChooseUs></WhyChooseUs>

        </>
    )
}

export default Home