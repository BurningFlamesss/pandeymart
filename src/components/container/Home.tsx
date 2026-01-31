import HomeBanner from '../layout/home/HomeBanner'
import Prod from '../shared/Prod'
import Products from '../shared/Products'
import { products } from '@/config/mockProducts'

function Home() {
    return (
        <>
            <HomeBanner />
            <Products products={products} />
            {/* <Prod></Prod> */}
        </>
    )
}

export default Home