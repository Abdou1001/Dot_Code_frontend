import { ServiceIcon } from "./ServiceIcon";
import type { LocalizedService } from "./services.utils";

interface ServiceCardProps {
    service: LocalizedService;
}

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <article className="service-card">
            <div className="service-card-icon">
                <ServiceIcon icon={service.icon} />
            </div>
            <div className="min-w-0">
                <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{service.title}</h3>
                {service.description ? (
                    <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">{service.description}</p>
                ) : null}
            </div>
        </article>
    );
}
