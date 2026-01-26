import { Link } from "@tanstack/react-router";

interface LinksType {
    href: string;
    text: string;
}

interface FooterSectionProps {
    Heading: string;
    CTA: string;
    CTALink: string;
    LogoSrc: string;
    LogoAlt: string;
    Links: Array<LinksType>;
    Attribution: string;
}

function FooterSection({ Heading, CTA, CTALink, LogoSrc, LogoAlt, Links, Attribution }: FooterSectionProps) {
    return (
        <div className="footer relative w-full h-[38svh] p-8 flex flex-col justify-center overflow-hidden">

            <div className="cta flex flex-row items-center justify-between gap-8">
                <h1>{Heading}</h1>
                <Link to={CTALink}>
                    <button>
                        {CTA}
                    </button>
                </Link>
            </div>
            <div className="foot flex flex-row justify-between items-center mt-16">
                <div className="links flex flex-row gap-8">
                    <img className="w-6 h-6" src={LogoSrc} alt={LogoAlt} />
                    {Links.map((link, index) => (
                        <Link className="links-border" key={index} to={link.href}>{link.text}</Link>
                    ))}
                </div>
                <p>{Attribution}</p>
            </div>
        </div>
    )
}

export default FooterSection