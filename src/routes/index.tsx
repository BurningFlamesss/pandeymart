import { createFileRoute } from '@tanstack/react-router'
import Landing from '@/components/landing/Landing'
import FooterSection from '@/components/landing/FooterSection'

export const Route = createFileRoute('/')({ component: App })

function App() {


  return (
    <Landing>
      Hello
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
