import Image from "next/image";
import { Code2, ExternalLink, FolderCode } from "lucide-react";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon";
import type { PortfolioProject } from "./projects.utils";

interface ProjectCardProps {
    project: PortfolioProject;
    githubLabel: string;
    liveLabel: string;
    imageFallbackLabel: string;
}

export function ProjectCard({ project, githubLabel, liveLabel, imageFallbackLabel }: ProjectCardProps) {
    return (
        <article className="project-card snap-center" data-project-card>
            <div className="project-card-media">
                {project.image ? (
                    <Image
                        src={project.image.image_url}
                        alt={project.image.alt || project.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 767px) 84vw, (max-width: 1279px) 58vw, 32rem"
                        className="object-cover"
                    />
                ) : (
                    <div aria-label={imageFallbackLabel} className="grid h-full place-items-center bg-accent text-muted-foreground">
                        <FolderCode aria-hidden="true" className="size-12" strokeWidth={1.4} />
                    </div>
                )}

                {(project.github_url || project.live_url) ? (
                    <div className="project-card-links">
                        {project.github_url ? (
                            <a href={project.github_url} target="_blank" rel="noreferrer" className="project-link" data-cursor-link>
                                <Code2 aria-hidden="true" className="size-4" />
                                <span>{githubLabel}</span>
                            </a>
                        ) : null}
                        {project.live_url ? (
                            <a href={project.live_url} target="_blank" rel="noreferrer" className="project-link project-link--primary" data-cursor-link>
                                <span>{liveLabel}</span>
                                <ExternalLink aria-hidden="true" className="size-4" />
                            </a>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <div className="flex min-h-48 flex-col p-6 sm:p-7">
                <h3 className="text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
                {project.description ? <p className="project-card-description mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{project.description}</p> : null}

                {project.technologies?.length ? (
                    <ul className="mt-auto flex flex-wrap gap-3 border-t border-border/70 pt-5" aria-label={`${project.title} technologies`}>
                        {project.technologies.map((technology) => (
                            <li key={technology.id} title={technology.name}>
                                <TechnologyIcon icon={technology.icon ?? technology.slug} name={technology.name} size={24} />
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </article>
    );
}
