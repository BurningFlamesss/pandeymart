import HomeBanner from '../layout/home/HomeBanner'
import Products from '../shared/Products'
import { products } from '@/config/mockProducts'

function Home() {
    return (
        <>
            <HomeBanner />
            <Products mode='vertical' products={products} />

        </>
    )
}

export default Home