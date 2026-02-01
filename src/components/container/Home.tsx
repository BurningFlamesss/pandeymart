import HomeAd from '../layout/home/HomeAd'
import HomeBanner from '../layout/home/HomeBanner'
import Products from '../layout/home/Products'
import WhyChooseUs from '../layout/home/WhyChooseUs'
import { products } from '@/config/mockProducts'

function Home() {
    return (
        <>
            <HomeBanner />
            <Products products={products} />
            <HomeAd />
            <WhyChooseUs></WhyChooseUs>
        </>
    )
}

export default Home