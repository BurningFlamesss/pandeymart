function HomeAd() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 px-2 lg:px-8 xl:px-12 py-8 sm:py-16 gap-5 lg:gap8">
        <div className="order-banner">
            <img width="1570" height="771" className="w-full h-full bg-transparent" src="/ads/delivery-ad.svg" alt="" />
        </div>
        <div className="order-banner">
            <img width="1570" height="771" className="w-full h-full bg-transparent" src="/ads/product-ad.svg" alt="" />
        </div>
    </div>  
  )
}

export default HomeAd