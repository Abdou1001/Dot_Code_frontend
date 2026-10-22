import {Badge} from "@/components/ui/badge";

interface DataTableStatusProps {
    status?: string | boolean;
    type?: "project" | "boolean" | "message";
}

export function DataTableStatus({status, type = "boolean"}: DataTableStatusProps) {
    if (type === "project") {
        switch (status) {
            case "published":
                return (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25">
                        منشور
                    </Badge>
                );
            case "draft":
                return (
                    <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25">
                        مسودة
                    </Badge>
                );
            case "hidden":
                return (
                    <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 hover:bg-slate-500/25">
                        مخفي
                    </Badge>
                );
            default:
                return <Badge variant="outline">{String(status)}</Badge>;
        }
    }

    if (type === "message") {
        switch (status) {
            case "new":
                return (
                    <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25">
                        جديدة
                    </Badge>
                );
            case "read":
                return (
                    <Badge className="bg-slate-500/15 text-slate-300 border-slate-500/30 hover:bg-slate-500/25">
                        مقروءة
                    </Badge>
                );
            case "replied":
                return (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25">
                        تم الرد
                    </Badge>
                );
            case "archived":
                return (
                    <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25">
                        مؤرشفة
                    </Badge>
                );
            default:
                return <Badge variant="outline">{String(status)}</Badge>;
        }
    }

    // Default boolean active/inactive
    const isActive = Boolean(status);
    return (
        <Badge
            className={
                isActive
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                    : "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25"
            }>
            {isActive ? "نشط" : "غير نشط"}
        </Badge>
    );
}

export default DataTableStatus;
