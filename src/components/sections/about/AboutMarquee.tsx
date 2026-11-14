// 6 items (3 outline/solid pairs) per sequence ensures seamless coverage across all screen widths
const MARQUEE_ITEMS = Array.from({ length: 6 }, (_, index) => index);

export function AboutMarquee() {

    const renderSequence = (prefix: string) =>
        MARQUEE_ITEMS.map((index) => (
            <span key={`${prefix}-${index}`} className="about-marquee-item">
                <span className={index % 2 === 0 ? "about-marquee-outline" : "about-marquee-solid"}>
                    ABOUT ME
                </span>
                <span className="about-marquee-dot" aria-hidden="true" />
            </span>
        ));

    return (
        <div dir="ltr" aria-hidden="true" className="about-marquee">
            <div className={`about-marquee-track about-marquee-track--ltr`}>
                <div className="about-marquee-sequence">{renderSequence("first")}</div>
                <div className="about-marquee-sequence" aria-hidden="true">{renderSequence("second")}</div>
            </div>
        </div>
    );
}
