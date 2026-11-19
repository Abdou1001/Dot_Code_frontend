import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Calendar, CheckCircle2, Layers, UserCheck } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon";
import { getLocale } from "@/lib/locale";
import { getPublicProjectBySlug } from "@/services/portfolio-hero.server";
import { sortProjectImages, stripHtmlTags } from "@/components/sections/projects/projects.utils";
import { ProjectGallery } from "./ProjectGallery";
import type { ProjectTranslation } from "@/types/data";

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

function getTranslation(project: { translation?: ProjectTranslation; translations?: ProjectTranslation[] }, locale: string): ProjectTranslation | undefined {
    return project.translation
        ?? project.translations?.find((t) => t.locale === locale)
        ?? project.translations?.find((t) => t.locale === "ar")
        ?? project.translations?.find((t) => t.locale === "en")
        ?? project.translations?.[0];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const cookieStore = await cookies();
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const project = await getPublicProjectBySlug(slug, locale);

    if (!project) {
        return {
            title: "Project Not Found | Dot Code",
        };
    }

    const translation = getTranslation(project, locale);
    const title = translation?.meta_title || translation?.title || project.slug;
    const description = translation?.meta_description || stripHtmlTags(translation?.description) || "Dot Code Software Studio Project Showcase";
    const primaryImage = sortProjectImages(project.images)[0];

    return {
        title: `${title} | Dot Code`,
        description,
        openGraph: {
            title: `${title} | Dot Code`,
            description,
            images: primaryImage ? [{ url: primaryImage.image_url }] : [],
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const isRtl = locale === "ar";
    const project = await getPublicProjectBySlug(slug, locale);

    if (!project) {
        notFound();
    }

    const translation = getTranslation(project, locale);
    const title = translation?.title || project.slug;
    const images = sortProjectImages(project.images);

    const copy = {
        ar: {
            back: "العودة إلى الأعمال",
            overview: "نظرة عامة على المشروع",
            challenge: "التحدي والاحتياج",
            solution: "الحل البرمجي والتنفيذ",
            result: "النتائج والأثر",
            technologies: "التقنيات المستخدمة",
            projectDetails: "تفاصيل المشروع",
            role: "الدور والمسؤولية",
            categories: "التصنيف",
            status: "الحالة",
            completed: "مكتمل ومنشور",
            date: "تاريخ الإنشاء",
            liveSite: "زيارة الموقع / التطبيق",
            sourceCode: "الكود المصدري",
            ctaHeading: "هل لديك فكرة مشروع مماثل؟",
            ctaDescription: "نساعدك في تحويل أفكارك واحتياجاتك التقنية إلى منتجات رقمية متكاملة وعالية الأداء.",
            ctaButton: "تواصل معنا لبدء مشروعك",
        },
        en: {
            back: "Back to Projects",
            overview: "Project Overview",
            challenge: "The Challenge",
            solution: "The Solution",
            result: "Results & Impact",
            technologies: "Technologies Used",
            projectDetails: "Project Details",
            role: "Role & Responsibility",
            categories: "Category",
            status: "Status",
            completed: "Completed & Live",
            date: "Created Date",
            liveSite: "Live Application",
            sourceCode: "Source Code",
            ctaHeading: "Have a similar project in mind?",
            ctaDescription: "Let's turn your vision and technical requirements into high-performance, scalable software.",
            ctaButton: "Get in Touch",
        },
    }[locale];

    const BackIcon = isRtl ? ArrowRight : ArrowLeft;

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground" dir={isRtl ? "rtl" : "ltr"}>
            <Navbar />

            <main className="flex-1 pb-20 sm:pb-28">
                {/* 1. Header Container */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                    {/* Back Link */}
                    <div className="mb-6 sm:mb-8">
                        <Link
                            href="/#projects"
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:border-neutral-300 dark:hover:border-neutral-700 transition-all backdrop-blur-sm shadow-xs"
                        >
                            <BackIcon className="size-4" />
                            <span>{copy.back}</span>
                        </Link>
                    </div>

                    {/* Project Title & Meta Banner */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border/70">
                        <div className="max-w-3xl space-y-4">
                            {/* Categories Badges */}
                            {project.categories?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.categories.map((category) => (
                                        <span
                                            key={category.id}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                                        >
                                            <span className="size-1.5 rounded-full bg-primary" />
                                            {isRtl ? (category.name_ar || category.name) : category.name}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                                {title}
                            </h1>

                            {translation?.role && (
                                <p className="text-base sm:text-lg font-medium text-muted-foreground flex items-center gap-2">
                                    <UserCheck className="size-5 text-primary shrink-0" />
                                    <span>{translation.role}</span>
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {(project.live_url || project.github_url) && (
                            <div className="flex flex-wrap items-center gap-3">
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-xs"
                                    >
                                        <Code2 className="size-4" />
                                        <span>{copy.sourceCode}</span>
                                    </a>
                                )}
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-primary bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all shadow-md"
                                    >
                                        <span>{copy.liveSite}</span>
                                        <ExternalLink className="size-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Media Showcase Gallery */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
                    <ProjectGallery images={images} title={title} />
                </div>

                {/* 3. Content Details & Sidebar */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Main Content Column (8 cols) */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Overview */}
                            {translation?.description && (
                                <section className="space-y-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#121316] p-6 sm:p-8 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                        {copy.overview}
                                    </h2>
                                    <div
                                        className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: translation.description }}
                                    />
                                </section>
                            )}

                            {/* Challenge / Solution / Result Blocks */}
                            {(translation?.challenge || translation?.solution || translation?.result) && (
                                <div className="space-y-6">
                                    {translation.challenge && (
                                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 space-y-3">
                                            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                {copy.challenge}
                                            </h3>
                                            <p className="text-base leading-relaxed text-muted-foreground">
                                                {translation.challenge}
                                            </p>
                                        </div>
                                    )}

                                    {translation.solution && (
                                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-3">
                                            <h3 className="text-lg font-bold text-primary">
                                                {copy.solution}
                                            </h3>
                                            <p className="text-base leading-relaxed text-muted-foreground">
                                                {translation.solution}
                                            </p>
                                        </div>
                                    )}

                                    {translation.result && (
                                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 space-y-3">
                                            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                {copy.result}
                                            </h3>
                                            <p className="text-base leading-relaxed text-muted-foreground">
                                                {translation.result}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Technologies Stack */}
                            {project.technologies?.length ? (
                                <section className="space-y-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#121316] p-6 sm:p-8 shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                                        <Layers className="size-5 text-primary" />
                                        <span>{copy.technologies}</span>
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {project.technologies.map((tech) => (
                                            <div
                                                key={tech.id}
                                                className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800/90 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40"
                                            >
                                                <TechnologyIcon
                                                    icon={tech.icon ?? tech.slug}
                                                    name={tech.name}
                                                    size={20}
                                                    useBrandColor={false}
                                                    className="text-foreground fill-current"
                                                />
                                                <span>{tech.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : null}
                        </div>

                        {/* Sidebar Column (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#121316] p-6 sm:p-7 shadow-sm space-y-6">
                                <h3 className="text-lg font-bold tracking-tight text-foreground border-b border-border/70 pb-4">
                                    {copy.projectDetails}
                                </h3>

                                <div className="space-y-5 text-sm">
                                    {/* Role */}
                                    {translation?.role && (
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                                                {copy.role}
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {translation.role}
                                            </span>
                                        </div>
                                    )}

                                    {/* Category */}
                                    {project.categories?.length ? (
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                                                {copy.categories}
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {project.categories.map((c) => isRtl ? (c.name_ar || c.name) : c.name).join(" / ")}
                                            </span>
                                        </div>
                                    ) : null}

                                    {/* Status */}
                                    <div>
                                        <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                                            {copy.status}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-4" />
                                            <span>{copy.completed}</span>
                                        </span>
                                    </div>

                                    {/* Date */}
                                    {project.created_at && (
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                                                {copy.date}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                                <Calendar className="size-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(project.created_at).toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                    })}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact CTA Card */}
                            <div className="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/10 via-primary/5 to-transparent p-6 sm:p-7 space-y-4">
                                <h3 className="text-lg font-bold text-foreground">
                                    {copy.ctaHeading}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {copy.ctaDescription}
                                </p>
                                <Link
                                    href="/#contact"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
                                >
                                    <span>{copy.ctaButton}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
