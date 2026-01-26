import { createFileRoute } from '@tanstack/react-router'
import Landing from '@/components/landing/Landing'
import FooterSection from '@/components/landing/FooterSection'
import HeroSection from '@/components/landing/HeroSection'
import ContentSection from '@/components/landing/ContentSection'

export const Route = createFileRoute('/')({ component: App })

function App() {


  return (
    <Landing>
      <HeroSection
        Heading="Welcome To PandeyMart"
        Subheading="Your one-stop shop for everything you need!"
        CTA="Shop Now"
        CTALink="/products"
        HeroImageSrc='/hero.svg'
        HeroImageAlt='PandeyMart Hero Image'
        HeroFloatingImageSrc='/hero-phone.svg'
        HeroFloatingImageAlt='PandeyMart Floating Image'
      />
      <ContentSection
        rightTitle="Order Products Easily"
        rightDescription="Browse and order a wide variety of products from the comfort of your home."
        rightImageSrc="/order-easily.svg"
        rightImageAlt="Right Image"
        leftTitle="Fast Delivery"
        leftDescription="Get your products delivered quickly and efficiently."
        leftImageSrc="/fast-delivery.svg"
        leftImageAlt="Left Image"
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
