import { Navbar } from "@/components/layout/navbar";
import { AboutSection } from "@/components/sections/about";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { ServicesSection } from "@/components/sections/services";
import { TestimonialsSection } from "@/components/sections/testimonials";

export default function HomePage() {
    return (
        <div id="top" className="min-h-screen flex flex-col bg-transparent text-foreground">
            {/* Top Navbar */}
            <Navbar />

            <main className="flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <HeroSection />
                </div>

                <AboutSection />

                <TestimonialsSection />

                <ServicesSection />

                <ProjectsSection />

                {/* Semantic section placeholders retained for Navbar scroll targets. */}
                <div className="mx-auto w-full max-w-7xl space-y-32 px-6 py-12">
                <section
                    id="skills"
                    aria-label="Skills section"
                    className="min-h-[40vh] rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 flex items-center justify-center p-8 text-neutral-400 dark:text-neutral-600 text-sm font-mono">
                    #skills
                </section>

                <section
                    id="contact"
                    aria-label="Contact section"
                    className="min-h-[40vh] rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 flex items-center justify-center p-8 text-neutral-400 dark:text-neutral-600 text-sm font-mono">
                    #contact
                </section>
                </div>
            </main>
        </div>
    );
}

