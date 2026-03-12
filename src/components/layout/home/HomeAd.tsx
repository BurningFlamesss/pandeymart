import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"

function HomeAd() {
  const {totalItems}  = useCart()
  const navigate = useNavigate()

  const handleNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if(totalItems > 0) {
        navigate({
          to: '/checkout'
        })
    } else {
      toast.error("Your cart is empty. Please add items to your cart before proceeding to checkout.")
    }

  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 px-2 lg:px-8 xl:px-12 py-8 sm:py-16 gap-5 lg:gap-8">
        <div onClick={handleNavigation} className="order-banner">
            <img width="1570" height="771" className="w-full h-full bg-transparent" src="/ads/delivery-ad.svg" alt="" />
        </div>
        <div onClick={handleNavigation} className="order-banner">
            <img width="1570" height="771" className="w-full h-full bg-transparent" src="/ads/product-ad.svg" alt="" />
        </div>
    </div>  
  )
}

export default HomeAd