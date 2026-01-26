import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function Header() {
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
                    <AvatarImage src="/pandeymart.png" alt="User Avatar" />
                    <AvatarFallback>UR</AvatarFallback>
                </Avatar>
            </div>
        </div>
    </header>
  )
}

export default Header