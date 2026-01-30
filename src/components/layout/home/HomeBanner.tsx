import React, { useEffect, useState } from 'react'
import type { CarouselApi } from "@/components/ui/carousel"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


const products = [
    {
        id: 1,
        image: "/banner/banner-1.svg"
    },
    {
        id: 2,
        image: "/banner/banner-2.svg"
    }
]

function HomeBanner() {
    const [api, setApi] = useState<CarouselApi | null>(null)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (!api) return

        setIndex(api.selectedScrollSnap())

        api.on("select", () => {
            setIndex(api.selectedScrollSnap())
        })

        const interval = setInterval(() => {
            api.scrollNext()
        }, 3000)

        return () => clearInterval(interval)
    }, [api])

    return (
        <div className="h-full flex flex-col items-center justify-center gap-4">

            <div className="max-w-300 relative">
                <Carousel
                    setApi={setApi}
                    opts={{
                        loop: true,
                        align: "start",
                        dragFree: false
                    }}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent>
                        {products.map(product => (
                            <CarouselItem key={product.id} className="w-full">
                                <div className="relative w-full aspect-video md:h-[350px] lg:h-[400px] bg-white">
                                    <img
                                        src={product.image}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}

export default HomeBanner