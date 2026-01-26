import { Link } from '@tanstack/react-router'

interface HeroSectionProps {
    Heading: string;
    Subheading: string;
    CTA: string;
    CTALink: string;
    HeroImageSrc: string;
    HeroImageAlt: string;
    HeroFloatingImageSrc: string;
    HeroFloatingImageAlt: string;
}

function HeroSection({ Heading, Subheading, CTA, CTALink, HeroImageSrc, HeroImageAlt, HeroFloatingImageSrc, HeroFloatingImageAlt }: HeroSectionProps) {

    return (
        <div className="hero relative w-full h-[120svh] p-0 bg-white flex flex-col items-center justify-center overflow-hidden">
            <div className="content flex flex-col items-center justify-center gap-8 mt-18">
                <h1>{Heading}</h1>
                <p>{Subheading}</p>
                <Link to={CTALink}>
                    <button>{CTA}</button>
                </Link>
            </div>
            <div className="hero-image">
                <img src={HeroImageSrc} alt={HeroImageAlt} />
            </div>
            <div className="hero-floating-image">
                <img src={HeroFloatingImageSrc} alt={HeroFloatingImageAlt} />
            </div>
        </div>
    )
}

export default HeroSection