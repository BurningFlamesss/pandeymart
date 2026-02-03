import { useEffect, useState } from "react";

interface FavouriteProduct {
    productId: string;
}

interface useFavouriteReturn {
    favourite: Array<FavouriteProduct>,
    addToFavourite: (product: FavouriteProduct) => void,
    removeFromFavourite: (productId: string) => void;
    clearFavourite: () => void;

}

const FAVOURITE_KEY = "favourite"

export const useFavourite = (): useFavouriteReturn => {
    const [favourite, setFavourite] = useState<Array<FavouriteProduct>>([]);

    useEffect(() => {
        if (typeof window === "undefined") return

        const saved = localStorage.getItem(FAVOURITE_KEY)
        if (saved) {
            try {
                setFavourite(JSON.parse(saved))
            } catch (error) {
                localStorage.removeItem(FAVOURITE_KEY)
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return

        localStorage.setItem(FAVOURITE_KEY, JSON.stringify(favourite))
    }, [])


    const addToFavourite = (product: FavouriteProduct) => {
        setFavourite(prev => {
            return [...(new Set([...prev, product]))];
        });
    };

    const removeFromFavourite = (productId: string) => {
        setFavourite(prev => prev.filter(item => item.productId !== productId));
    };

    const clearFavourite = () => {
        setFavourite([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(FAVOURITE_KEY);
        }
    }

    return {
        favourite,
        addToFavourite,
        removeFromFavourite,
        clearFavourite
    }
}