import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import type { AppContext } from '@/types/router-context'
import { authClient } from '@/lib/auth-client'

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
                    <h1 className='brand-name'>PandeyMart</h1>
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
    if (!session?.user.id) {
        return <Link to='/authenticate' search={{ mode: "signup" }}>
            <Button size={"sm"}>
                Sign Up
            </Button>
        </Link>
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer'>
                    <Avatar>
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

