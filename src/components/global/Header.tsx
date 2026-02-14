import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { FaRegHeart } from "react-icons/fa6";
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button, buttonVariants } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import CartProductLists from '../layout/home/CartProductLists';
import type { AppContext } from '@/types/router-context'
import { authClient } from '@/lib/auth-client'
import { useCart } from '@/hooks/use-cart';
import { getProducts } from '@/server/functions/getProducts';
import { useMemo } from 'react';

function Header() {
    const { data: session, isPending } = authClient.useSession()

    const signOut = async () => {
        await authClient.signOut()
    }

    return (
        <header className='site-header'>
            <div className='header-inner'>
                <Link to='/' className='brand'>
                    <img src="/pandeymart.png" alt="" />
                    <h1 className='brand-name hidden lg:inline'>PandeyMart</h1>
                </Link>
                <nav className='nav-links' aria-label='Main Navigations'>
                    <Link className="links-border" to="/">Home</Link>
                    <Link className="links-border" to="/product">Products</Link>
                </nav>
                <div className='header-actions cursor-pointer'>
                    <DropdownUserMenu session={session} signOut={() => signOut()} />
                </div>
            </div>
        </header>
    )
}

const DropdownUserMenu = ({ session, signOut }: { session: AppContext['session'], signOut: () => void }) => {
    const { cart, totalPrice } = useCart()

    const { data: realProducts = [], isError, isPending } = useQuery({
        queryKey: ['cart-products', cart.map(cartItem => cartItem.productId).sort().join(",")],
        queryFn: () => {
            if (cart.length === 0) return []
            const uniqueIds = [...new Set(cart.map(item => item.productId))]

            return getProducts({ data: uniqueIds })
        },
    })

    console.log("Cart: ", cart)
    console.log("Products: ", realProducts)

    const productMap = useMemo(() => {
        return new Map(realProducts.map(product => [product.productId, product]))
    }, [realProducts])

    const mergedItems = useMemo(() => {
        return cart.map((cartItem) => ({
            ...cartItem,
            product: productMap.get(cartItem.productId)
        }))
    }, [cart, productMap])

    if (!session?.user.id) {
        return <Link to='/authenticate' search={{ mode: "signup" }}>
            <Button size={"sm"}>
                Sign Up
            </Button>
        </Link>
    }

    return (
        <>
            <Link to='/favourite'>
                <div className="relative w-8 h-8 p-1 flex flex-row items-center justify-center gap-1.5 cursor-pointer transition-all bg-[#f0f0f0] border border-muted rounded-full">
                    <FaRegHeart height={20} width={20}></FaRegHeart>
                    {/* <span className="absolute top-0 -right-1 flex flex-row items-center justify-center bg-[#FAA016] text-white font-medium text-xs w-4 h-4 rounded-full">
                        1
                    </span> */}
                </div>
            </Link>
            <Sheet>
                <SheetTrigger>
                    <div className="relative w-8 h-8 p-1 flex flex-row items-center justify-center gap-1.5 cursor-pointer transition-all bg-[#f0f0f0] border border-muted rounded-full">
                        <ShoppingCart height={20} width={20}></ShoppingCart>
                        <span className="absolute top-0 -right-1 flex flex-row items-center justify-center bg-[#FAA016] text-white font-medium text-xs w-4 h-4 rounded-full">
                            {cart.length}
                        </span>
                    </div>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit your cart</SheetTitle>
                        <SheetDescription>Manage your orders ({cart.length})</SheetDescription>
                    </SheetHeader>
                    <div data-lenis-prevent className="no-scrollbar overflow-y-auto px-4 py-2">
                        {
                            isPending ? (
                                <div className='h-[60vh] w-full flex items-center justify-center'>
                                    Getting the items...
                                </div>
                            ) : isError ? (
                                <div className='h-[60vh] w-full flex items-center justify-center'>
                                    Something Went Wrong!
                                </div>
                            ) : mergedItems.length === 0 ? (
                                <div className='h-[60vh] w-full flex items-center justify-center'>
                                    Looks like you dont have added any item to the cart
                                </div>
                            ) : <div className='h-full w-full flex flex-col items-center gap-2'>
                                {mergedItems.map((item, i) => {
                                    if (!item.product) return null
                                    return (
                                        <CartProductLists product={item.product} cartItem={item} key={`cart-${item.cartItemId}`} index={i} />
                                    )
                                })}
                            </div>
                        }
                    </div>
                    <SheetFooter>
                        <Link to='/checkout' className={buttonVariants()}>Checkout (Rs. {totalPrice})</Link>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer'>
                    <Avatar className='border border-muted p-0.5'>
                        <AvatarImage src={session.user.image ? session.user.image : "/pandeymart.png"} alt="User Avatar" />
                        <AvatarFallback>UR</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-60' align='end'>
                    <Button onClick={() => signOut()} variant={'destructive'} className='cursor-pointer w-full'>
                        Logout
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}

export default Header

