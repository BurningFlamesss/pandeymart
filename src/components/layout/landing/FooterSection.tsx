import { Link } from "@tanstack/react-router";
import Button from "@/components/shared/Button";
import { authClient } from "@/lib/auth-client";

interface LinksType {
    href: string;
    text: string;
}

interface FooterSectionProps {
    Heading: string;
    LogoSrc: string;
    LogoAlt: string;
    Links: Array<LinksType>;
    Attribution: string;
}

function FooterSection({ Heading, LogoSrc, LogoAlt, Links, Attribution }: FooterSectionProps) {
    const { data: session } = authClient.useSession()
    const CTA = session?.user.id ? "View Products" : "Sign Up"
    const CTALink = session?.user.id ? "/product" : "/authenticate?mode=signup"

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