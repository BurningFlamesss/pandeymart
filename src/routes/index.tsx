import { createFileRoute } from '@tanstack/react-router'
import Landing from '@/components/landing/Landing'
import FooterSection from '@/components/landing/FooterSection'
import HeroSection from '@/components/landing/HeroSection'

export const Route = createFileRoute('/')({ component: App })

function App() {


  return (
    <Landing>
      <HeroSection
        Heading="Welcome To PandeyMart"
        Subheading="Your one-stop shop for everything you need!"
        CTA="Shop Now"
        CTALink="/products"
        HeroImageSrc=''
        HeroImageAlt='PandeyMart Hero Image'
        HeroFloatingImageSrc=''
        HeroFloatingImageAlt='PandeyMart Floating Image'
      />
      <FooterSection
        Heading="Get Started"
        CTA="Sign Up"
        CTALink="/authenticate"
        LogoSrc="/pandeymart.png"
        LogoAlt="PandeyMart Logo"
        Links={[
          { href: "/about", text: "About Us" },
          { href: "/contact", text: "Contact" },
          { href: "/privacy", text: "Privacy Policy" }
        ]}
        Attribution="© 2026 PandeyMart. All rights reserved."
      />
    </Landing>
  )
}
