import { useContext } from "react"
import { FavouriteContext } from "@/context/FavouriteContext"

export const useFavourite = () => {
    const context = useContext(FavouriteContext)

    if (!context) {
        throw new Error("useFavourite must be used inside FavouriteProvider")
    }


    return context
}