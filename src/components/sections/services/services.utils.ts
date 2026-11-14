import type { Service, ServiceTranslation } from "@/types/data";
import type { Locale } from "@/types/enums";

export interface LocalizedService extends Service {
    title: string;
    description?: string;
}

function getTranslation(translations: ServiceTranslation[] | undefined, locale: Locale) {
    return translations?.find((translation) => translation.locale === locale)
        ?? translations?.find((translation) => translation.locale === "en")
        ?? translations?.[0];
}

export function localizeServices(services: Service[], locale: Locale): LocalizedService[] {
    return services.flatMap((service) => {
        const translation = getTranslation(service.translations, locale);

        if (!translation) return [];

        return [{
            ...service,
            title: translation.title,
            description: translation.description,
        }];
    });
}
