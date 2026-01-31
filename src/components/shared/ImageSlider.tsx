import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

interface ImageSliderProps {
    url: string;
    imgClasses?: string;
    isHovered?: boolean;
}

const ImageSlider = ({ url, imgClasses, isHovered }: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Simulating two images for hover effect (you can pass multiple images as array)
    const images = [url, url]; // Replace second with actual second image URL if available

    return (
        <div className="group/slider relative bg-white overflow-hidden h-full w-full">
            {/* Primary Image */}
            <img
                className={cn(
                    "absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-500",
                    imgClasses,
                    isHovered ? "opacity-0" : "opacity-100"
                )}
                src={images[0]}
                alt="Product primary view"
            />
            
            {/* Hover Image */}
            <img
                className={cn(
                    "absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-500",
                    imgClasses,
                    isHovered ? "opacity-100" : "opacity-0"
                )}
                src={images[1]}
                alt="Product secondary view"
            />

            {/* Swiper for additional images (optional) */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-300",
                "opacity-0 pointer-events-none"
            )}>
                <Swiper
                    pagination={{
                        renderBullet: (_, className) => {
                            return `<span class="rounded-full transition ${className}"></span>`;
                        },
                    }}
                    spaceBetween={0}
                    modules={[Pagination]}
                    slidesPerView={1}
                    className="h-full w-full"
                    onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                >
                    {images.map((image, idx) => (
                        <SwiperSlide
                            key={idx}
                            className="relative h-full w-full bg-white flex items-center justify-center"
                        >
                            <img
                                className={cn(
                                    "h-full w-full object-cover",
                                    imgClasses
                                )}
                                src={image}
                                alt={`Product view ${idx + 1}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ImageSlider;