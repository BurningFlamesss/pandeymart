import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import appCss from '../styles.css?url'
import "../styles/globals.css"
import Header from '@/components/global/Header'
import GlobalProvider from '@/provider/GlobalProvider'

gsap.registerPlugin(ScrollTrigger)

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Pandey Mart',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const scroller = document.documentElement
    const lenis = new Lenis()

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (value !== undefined)
          lenis.scrollTo(value, { immediate: true })

        return lenis.scroll || window.scrollY
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      pinType: scroller.style.transform ? "transform" : "fixed"
    })

    ScrollTrigger.defaults({ scroller })

    const onTick = (time: number) => {
      lenis.raf(time * 2000)
    }

    const onLenisScroll = () => {
      ScrollTrigger.update()
    }

    lenis.on('scroll', onLenisScroll)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)


    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.scrollerProxy(scroller, {})
      gsap.ticker.remove(onTick)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        <GlobalProvider>
          {children}
        </GlobalProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
