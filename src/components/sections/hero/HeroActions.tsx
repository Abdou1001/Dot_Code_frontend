import { Download } from "lucide-react";
import { siGithub, siUpwork } from "simple-icons";
import type { Locale } from "@/types/enums";
import { Button } from "@/components/ui/button";


export function HeroActions({ locale }: { locale: Locale }) {
    const downloadLabel = locale === "ar" ? "تحميل السيرة الذاتية" : "Download CV";
    const socialLinks = [
        { label: "GitHub", href: "https://github.com/Abdou1001", path: siGithub.path },
        { label: "Upwork", href: "https://www.upwork.com/nx/find-work/best-matches", path: siUpwork.path },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/abdulrahman-bin-saad/", path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" },
    ];

    return (
        <div data-hero-intro className="hero-actions">
            <div className="hero-action-stack">
                <Button asChild size="lg" className="hero-cv-button">
                    <a href="/Abdulrahman_Ahemd%20Bin%20Saad_Full%20Stack%20Developer_resume.pdf" download>
                        <Download className="size-4" aria-hidden="true" />
                        {downloadLabel}
                    </a>
                </Button>
                <div className="hero-social-links" aria-label={locale === "ar" ? "روابط التواصل" : "Social links"}>
                    {socialLinks.map(({ label, href, path }) => (
                        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="hero-social-link">
                            <SocialIcon path={path} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SocialIcon({ path }: { path: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d={path} />
        </svg>
    );
}
