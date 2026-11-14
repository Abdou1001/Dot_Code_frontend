import { ServiceCard } from "./ServiceCard";
import type { LocalizedService } from "./services.utils";

interface ServicesGridProps {
    services: LocalizedService[];
    emptyMessage: string;
}

export function ServicesGrid({ services, emptyMessage }: ServicesGridProps) {
    if (services.length === 0) {
        return <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
    );
}
