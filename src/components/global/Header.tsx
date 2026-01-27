import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { authClient } from '@/lib/auth-client'



function Header() {
    const { data: session, isPending } = authClient.useSession()
    console.log(session)
    return (
        <header className='site-header'>
            <div className='header-inner'>
                <div className='brand'>
                    <img src="/pandeymart.png" alt="" />
                    <h1 className='brand-name'>PandeyMart</h1>
                </div>
                <nav className='nav-links' aria-label='Main Navigations'>
                    <Link className="links-border" to="/">Home</Link>
                    <Link className="links-border" to="/">Products</Link>
                </nav>
                <div className='header-actions cursor-pointer'>
                    <Avatar>
                        <AvatarImage src={session?.user.image ? session.user.image : "/pandeymart.png"} alt="User Avatar" />
                        <AvatarFallback>UR</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}

export default Header