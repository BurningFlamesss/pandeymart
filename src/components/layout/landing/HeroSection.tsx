import Button from '@/components/shared/Button';

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
        <div className="hero">
            <div className="content">
                <h1>{Heading}</h1>
                <p>{Subheading}</p>
                <Button href={CTALink} title={CTA}></Button>
            </div>
            <div className="hero-image">
                <img src={HeroImageSrc} alt={HeroImageAlt} />
            </div>
            {

                HeroFloatingImageSrc && (
                    <div className="hero-floating-image">
                        <img src={HeroFloatingImageSrc} alt={HeroFloatingImageAlt} />
                    </div>
                )
            }

        </div>
    )
}

export default HeroSection