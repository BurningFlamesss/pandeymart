import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { FaRegHeart } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import type { AppContext } from '@/types/router-context'
import type { IndividualProduct } from '@/types/Product';
import { authClient } from '@/lib/auth-client'
import { useCart } from '@/hooks/use-cart';

function Header() {
    const { data: session, isPending } = authClient.useSession()
    const {cart} = useCart()

    const signOut = async () => {
        await authClient.signOut()
    }

    return (
        <header className='site-header'>
            <div className='header-inner'>
                <Link to='/' className='brand'>
                    <img src="/pandeymart.png" alt="" />
                    <h1 className='brand-name'>PandeyMart</h1>
                </Link>
                <nav className='nav-links' aria-label='Main Navigations'>
                    <Link className="links-border" to="/">Home</Link>
                    <Link className="links-border" to="/product">Products</Link>
                </nav>
                <div className='header-actions cursor-pointer'>
                    <DropdownUserMenu cart={cart} session={session} signOut={() => signOut()} />
                </div>
            </div>
        </header>
    )
}

const DropdownUserMenu = ({ session, signOut, cart }: { session: AppContext['session'], signOut: () => void, cart: Array<IndividualProduct>}) => {
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
            <Link to='/checkout'>
                <div className="relative w-8 h-8 p-1 flex flex-row items-center justify-center gap-1.5 cursor-pointer transition-all bg-[#f0f0f0] border border-muted rounded-full">
                    <ShoppingCart height={20} width={20}></ShoppingCart>
                    <span className="absolute top-0 -right-1 flex flex-row items-center justify-center bg-[#FAA016] text-white font-medium text-xs w-4 h-4 rounded-full">
                        {cart.length}
                    </span>
                </div>
            </Link>
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

