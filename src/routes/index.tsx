import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import Landing from '@/components/container/Landing'
import HeroSection from '@/components/layout/landing/HeroSection'
import ContentSection from '@/components/layout/landing/ContentSection'

const FooterSection = lazy(() => import('@/components/layout/landing/FooterSection'))

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <Landing>
      <HeroSection
        Heading="Welcome To PandeyMart"
        Subheading="Your one-stop shop for everything you need!"
        CTA="Shop Now"
        CTALink="/product"
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
      <Suspense fallback={<div>Loading...</div>}>
        <FooterSection
          Heading="Get Started"
          LogoSrc="/pandeymart.png"
          LogoAlt="PandeyMart Logo"
          Links={[
            { href: "/about", text: "About Us" },
            { href: "/contact", text: "Contact" },
            { href: "/privacy", text: "Privacy Policy" }
          ]}
          Attribution="© 2026 PandeyMart. All rights reserved."
        />
      </Suspense>
    </Landing>
  )
}