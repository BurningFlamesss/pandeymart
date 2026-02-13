import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/context/CartContext"
import { FavouriteProvider } from "@/context/FavouriteContext"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})


function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                <FavouriteProvider>
                    <Toaster></Toaster>
                    {children}
                </FavouriteProvider>
            </CartProvider>
        </QueryClientProvider>
    )
}

export default GlobalProvider