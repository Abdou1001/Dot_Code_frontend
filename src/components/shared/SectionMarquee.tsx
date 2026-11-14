type SectionMarqueeProps = {
    label: string;
};

// Three outline/solid pairs per sequence keep the loop filled across screen widths.
const MARQUEE_ITEMS = Array.from({ length: 6 }, (_, index) => index);

export function SectionMarquee({ label }: SectionMarqueeProps) {
    const renderSequence = (prefix: string) =>
        MARQUEE_ITEMS.map((index) => (
            <span key={`${prefix}-${index}`} className="section-marquee-item">
                <span className={index % 2 === 0 ? "section-marquee-outline" : "section-marquee-solid"}>
                    {label}
                </span>
                <span className="section-marquee-dot" aria-hidden="true" />
            </span>
        ));

    return (
        <div dir="ltr" aria-hidden="true" className="section-marquee">
            <div className="section-marquee-track">
                <div className="section-marquee-sequence">{renderSequence("first")}</div>
                <div className="section-marquee-sequence" aria-hidden="true">
                    {renderSequence("second")}
                </div>
            </div>
        </div>
    );
}
