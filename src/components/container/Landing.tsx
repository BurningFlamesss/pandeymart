import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Landing({ children }: { children?: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const pathRef = useRef<SVGPathElement>(null)

    useEffect(() => {
        const scroller = document.documentElement
        ScrollTrigger.defaults({ scroller });
        const path = pathRef.current

        if (!path) return () => {
            ScrollTrigger.scrollerProxy(scroller, {})
        }

        const length = path.getTotalLength()

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        })

        const tween = gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: '8% top',
                end: 'bottom bottom',
                scrub: true,
                scroller,
            },
        })

        ScrollTrigger.refresh()

        return () => {
            tween.scrollTrigger?.kill()
            tween.kill()
            ScrollTrigger.scrollerProxy(scroller, {})
        }
    }, [])

    return (
        <div className="landing-page spotlight" ref={containerRef}>
            {children}

            <div className="svg-path">
                <svg
                    viewBox="0 0 1378 2760"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path
                        id="stroke-path"
                        ref={pathRef}
                        d="M639.668 100C639.668 100 105.669 100 199.669 601.503C293.669 1103.01 1277.17 691.502 1277.17 1399.5C1277.17 2107.5 -155.332 1968 140.168 1438.5C435.669 909.002 1442.66 2093.5 713.168 2659.5"
                        stroke="#FAA016"
                        strokeWidth="200"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    )
}

export default Landing