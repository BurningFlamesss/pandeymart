interface ContentSectionProps {
    rightTitle: string;
    rightDescription: string;
    rightImageSrc: string;
    rightImageAlt: string;
    leftTitle: string;
    leftDescription: string;
    leftImageSrc: string;
    leftImageAlt: string;
}

function ContentSection({ rightTitle, rightDescription, rightImageSrc, rightImageAlt, leftTitle, leftDescription, leftImageSrc, leftImageAlt }: ContentSectionProps) {
    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <h1>{rightTitle}</h1>
                        <p>{rightDescription}</p>
                    </div>
                </div>
                <div className="col">
                    <img src={rightImageSrc} alt={rightImageAlt} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <h1>{leftTitle}</h1>
                        <p>{leftDescription}</p>
                    </div>
                </div>
                <div className="col">
                    <img src={leftImageSrc} alt={leftImageAlt} />
                </div>
            </div>
        </>

    )
}

export default ContentSection