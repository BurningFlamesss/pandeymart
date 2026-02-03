import { createContext, useEffect, useState } from "react";

interface FavouriteContextType {
    favourite: Array<string>,
    addToFavourite: (product: string) => void,
    removeFromFavourite: (productId: string) => void;
    clearFavourite: () => void;

}

export const FavouriteContext = createContext<FavouriteContextType | null>(null)

const FAVOURITE_KEY = "favourite"

export const FavouriteProvider = ({ children }: { children: React.ReactNode }) => {
    const [favourite, setFavourite] = useState<Array<string>>([]);

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
    }, [favourite])


    const addToFavourite = (productId: string) => {
        setFavourite(prev =>
            prev.includes(productId) ? prev : [...prev, productId]
        );
    };

    const removeFromFavourite = (productId: string) => {
        setFavourite(prev => prev.filter(id => id !== productId));
    };

    const clearFavourite = () => {
        setFavourite([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(FAVOURITE_KEY);
        }
    }

    return (
        <FavouriteContext.Provider value={{
            favourite,
            addToFavourite,
            clearFavourite,
            removeFromFavourite
        }}>
            {children}
        </FavouriteContext.Provider>
    )
}