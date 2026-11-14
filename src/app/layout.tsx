import type {Metadata} from "next";
import {Cairo} from "next/font/google";
import {cookies} from "next/headers";

import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {LanguageProvider} from "@/components/providers/LanguageProvider";
import {Toaster} from "sonner";
import {getLocale} from "@/lib/locale";
import {getFloatingTechnologies} from "@/services/portfolio-hero.server";
import {FloatingTechBackground} from "@/components/layout/background/FloatingTechBackground";

const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-cairo",
});

export const metadata: Metadata = {
    title: "Dot Code | Software Studio Portfolio",
    description: "استوديو تطوير برمجي متكامل لتصميم وبناء التطبيقات الرقمية المتقدمة",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [cookieStore, technologies] = await Promise.all([cookies(), getFloatingTechnologies()]);
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const isRtl = locale === "ar";

    return (
        <html
            lang={locale}
            dir={isRtl ? "rtl" : "ltr"}
            suppressHydrationWarning
            className={`${cairo.variable} h-full antialiased`}>
            <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <FloatingTechBackground technologies={technologies} />
                <div className="relative z-10">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange>
                        <LanguageProvider initialLocale={locale}>
                            <QueryProvider>
                                {children}
                                <Toaster position="top-left" />
                            </QueryProvider>
                        </LanguageProvider>
                    </ThemeProvider>
                </div>
            </body>
        </html>
    );
}
