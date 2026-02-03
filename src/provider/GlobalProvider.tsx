import { Toaster } from "@/components/ui/sonner"
import { FavouriteProvider } from "@/context/FavouriteContext"

function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <FavouriteProvider>
            <Toaster></Toaster>
            {children}
        </FavouriteProvider>
    )
}

export default GlobalProvider