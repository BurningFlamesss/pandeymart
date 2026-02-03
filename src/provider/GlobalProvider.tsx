import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/context/CartContext"
import { FavouriteProvider } from "@/context/FavouriteContext"

function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <FavouriteProvider>
                <Toaster></Toaster>
                {children}
            </FavouriteProvider>
        </CartProvider>
    )
}

export default GlobalProvider