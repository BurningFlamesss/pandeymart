const whyChooseUsData = [
    {
        title: "Best quality",
        description: "Not only fast for us quality is also number one",
        src: "/whychooseus/1.png",
    },
    {
        title: "Easy to order",
        description: "You only need a few steps in ordering food",
        src: "/whychooseus/2.png",
    },
    {
        title: "Fastest delivery",
        description: "Delivery that is always on time even faster",
        src: "/whychooseus/3.png",
    }
]

function WhyChooseUs() {
    return (
        <>
            <div className="px-2 lg:px-8 xl:px-12 relative py-8">
                <div className="bg-[#F1F1F1] p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 rounded-sm">
                    {whyChooseUsData.map((data, index) => (
                        <div className="service-item flex items-center flex-col sm:flex-row gap-8">
                            <div className="service-image h-30 w-34">
                                <img alt="service-image" loading="lazy" width="100" height="100" className="w-full h-full object-contain" src={data.src} style={{ color: 'transparent' }} />
                            </div>
                            <div className="service-content sm:text-start text-center">
                                <span className="shadow-2xl bg-white p-2 rounded-2xl w-8 h-8">0{(index + 1)}</span>
                                <h4 className="text-xl font-medium pt-3">{data.title}</h4>
                                <p className="text-gray-600 max-w-55">{data.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default WhyChooseUs