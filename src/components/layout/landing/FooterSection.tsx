import { Link } from "@tanstack/react-router";
import Button from "@/components/shared/Button";

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
        <div className="footer">
            <div className="cta">
                <h1>{Heading}</h1>
                <Button href={CTALink} title={CTA}>
                </Button>
            </div>
            <div className="foot">
                <div className="links">
                    <img className="" src={LogoSrc} alt={LogoAlt} />
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