import { cn } from "@/lib/utils";

function SectionStarter({
    title,
    src,
    description="",
    className=""
}: {
    title: string;
    src?: string;
    description?: string;
    className?: string;
}) {
    return (
        <>
            <div className={cn("section-title flex flex-wrap gap-3 pb-10", className)}>
                <h2 className="text-3xl md:text-5xl font-bold">{title}</h2>
                <p className="text-black/50 flex items-center flex-wrap gap-4 text-lg md:text-xl font-medium">
                    {src && <img className="hidden lg:inline" alt="title-icon" loading="lazy" width="40" height="33" src={src} style={{ color: 'transparent' }} />}
                    {description}
                </p>
            </div>
        </>
    )
}

export default SectionStarter