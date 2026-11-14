import * as LucideIcons from "lucide-react";
import { Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;

function getIconName(value?: string) {
    const name = value?.match(/[A-Za-z][A-Za-z0-9-]*/)?.[0];

    return name?.replace(/(^|-)([a-z])/g, (_match, _separator, letter: string) => letter.toUpperCase());
}

export function ServiceIcon({ icon }: { icon?: string }) {
    const Icon = iconLibrary[getIconName(icon) ?? ""] ?? Wrench;

    return <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />;
}
