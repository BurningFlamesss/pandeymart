import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function Header() {
  return (
    <header className='site-header w-full border-b border-b-white bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='max-w-5xl mx-auto py-4 px-8 flex items-center justify-between gap-6'>
            <div className='inline-flex items-center gap-3 font-bold text-black'>
                <img className='w-10 h-10 object-contain' src="/pandeymart.png" alt="" />
                <h1 className='brand-name'>PandeyMart</h1>
            </div>
            <nav className='nav-links inline-flex items-center gap-5 font-semibold' aria-label='Main Navigations'>
                <Link to="/">Home</Link>
                <Link to="/">Products</Link>
            </nav>
            <div className='header-actions inline-flex items-center gap-3 cursor-pointer'>
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