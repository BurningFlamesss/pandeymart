const offersData = [{
    title: 'Get 29% off',
    description: 'Seafood calamari',
    href: '/',
    src: '/offers/banneroffers-01.webp'
}, {
    title: 'Get 49% off',
    description: 'Freshly baked toast',
    href: '/',
    src: '/offers/banneroffers-02.webp'
}, {
    title: 'Get 49% off',
    description: 'Fruits and vegetables',
    href: '/',
    src: '/offers/banneroffers-03.webp'
},]


function Offers() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-2 lg:px-8 xl:px-12 relative py-8 sm:py-16">
                {offersData.map((offer, index) => (
                    <div className="offer-banner relative w-full h-75 rounded-sm overflow-hidden">
                        <img
                            alt="offer-image"
                            loading="lazy"
                            width={1026}
                            height={574}
                            decoding="async"
                            data-nimg="1"
                            className="w-full h-full object-cover"
                            src={offer.src}
                            style={{ color: "transparent" }}
                        />

                        <div className="absolute top-0 left-0 w-full h-full pt-16 pl-10">
                            <span className="text-white underline uppercase font-medium">
                                {offer.title}
                            </span>
                            <h3 className="text-4xl text-white max-w-56">
                                {offer.description}
                            </h3>

                            <a
                                href={offer.href}
                                className="bg-[#FAA016] px-4 w-fit flex items-center py-2 mt-8 rounded-sm cursor-pointer hover:bg-black hover:text-white duration-300 transition-colors"
                            >
                                Shop Now
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    className="iconify iconify--formkit ms-2"
                                    width="16"
                                    height="9"
                                    viewBox="0 0 16 9"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                )
                )
                }
            </div>

        </>
    )
}

export default Offers