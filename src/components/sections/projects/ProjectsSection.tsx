import { cookies } from "next/headers";
import { getLocale } from "@/lib/locale";
import { getPublishedProjects } from "@/services/portfolio-hero.server";
import { CursorFollower } from "./CursorFollower";
import { ProjectCard } from "./ProjectCard";
import { projectsCopy } from "./projects.copy";
import { ProjectsScroller } from "./ProjectsScroller";
import { createPortfolioProjects } from "./projects.utils";

export async function ProjectsSection() {
    const cookieStore = await cookies();
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const projects = await getPublishedProjects();
    const portfolioProjects = createPortfolioProjects(projects, locale);
    const content = projectsCopy[locale];
    const isRtl = locale === "ar";

    return (
        <section id="projects" aria-labelledby="projects-title" className="overflow-hidden border-y border-border/70 bg-background py-16 sm:py-24 lg:py-28">
            <div dir={isRtl ? "rtl" : "ltr"} className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
                    <p className="text-sm font-semibold text-primary">{content.eyebrow}</p>
                    <h2 id="projects-title" className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {content.heading}
                    </h2>
                    <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{content.description}</p>
                </header>

                {portfolioProjects.length > 0 ? (
                    <ProjectsScroller count={portfolioProjects.length} currentLabel={content.progressLabel} scrollHint={content.scrollHint} isRtl={isRtl}>
                        {portfolioProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                githubLabel={content.github}
                                liveLabel={content.live}
                                imageFallbackLabel={content.imageFallback}
                            />
                        ))}
                    </ProjectsScroller>
                ) : (
                    <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">{content.empty}</p>
                )}
            </div>

            <CursorFollower label={content.view} />
        </section>
    );
}
