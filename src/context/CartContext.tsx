import { createContext, useEffect, useMemo, useState } from "react";
import type { IndividualProduct } from "@/types/Product";
import { calculateItemUnitPrice } from "@/utils/productUtils";

interface CartContextType {
    cart: Array<IndividualProduct>;
    addToCart: (product: IndividualProduct) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
}

export const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = "cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Array<IndividualProduct>>([]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const saved = localStorage.getItem(CART_KEY);
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch {
                localStorage.removeItem(CART_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: IndividualProduct) => {
        setCart(prev => {
            const existing = prev.find(
                item => item.cartItemId === product.cartItemId
            );

            if (existing) {
                return prev.map(item =>
                    item.cartItemId === product.cartItemId
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            }

            return [...prev, product];
        });
    };

    const removeFromCart = (cartItemId: string) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }

        setCart(prev =>
            prev.map(item =>
                item.cartItemId === cartItemId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(CART_KEY);
        }
    };

    const totalItems = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    const totalPrice = useMemo(
        () =>
            cart.reduce((sum, item) => {
                const unitPrice = calculateItemUnitPrice(
                    item.basePrice,
                    item.customizations ?? []
                );
                return sum + unitPrice * item.quantity;
            }, 0),
        [cart]
    );

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            totalItems,
        }}>
            {children}
        </CartContext.Provider>
    )
};
