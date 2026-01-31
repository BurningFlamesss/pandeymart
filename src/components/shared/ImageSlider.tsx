import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

interface ImageSliderProps {
    url: string;
    mode?: "horizontal" | "vertical";
    imgClasses?: string;
}

const ImageSlider = ({
    url,
    mode = "vertical",
    imgClasses,
}: ImageSliderProps) => {
    return (
        <div
            className={`group relative bg-zinc-100 overflow-hidden ${mode === "horizontal"
                    ? "h-full w-full rounded-l-xl"
                    : "aspect-video rounded-t-xl"
                }`}
        >
            <Swiper
                pagination={{
                    renderBullet: (_, className) => {
                        return `<span class="rounded-full transition ${className}"></span>`;
                    },
                }}
                spaceBetween={50}
                modules={[Pagination]}
                slidesPerView={1}
                className="h-full w-full"
            >
                <SwiperSlide className="relative h-full w-full bg-white flex items-center justify-center">
                    <img
                        className={`mx-auto h-full w-full object-cover ${imgClasses}`}
                        height={192}
                        width={341}
                        src={url}
                        alt="product images"
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default ImageSlider;