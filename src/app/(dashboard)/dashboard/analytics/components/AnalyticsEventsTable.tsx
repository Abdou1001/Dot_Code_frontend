"use client";

import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Laptop, Smartphone} from "lucide-react";
import {VisitorEvent} from "@/types/data";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import {Badge} from "@/components/ui/badge";

interface AnalyticsEventsTableProps {
    data: VisitorEvent[];
    isLoading: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
}

export function AnalyticsEventsTable({
    data,
    isLoading,
    pagination,
    onPageChange,
}: AnalyticsEventsTableProps) {
    const columns = useMemo<ColumnDef<VisitorEvent>[]>(
        () => [
            {
                accessorKey: "page_path",
                header: "المسار المزار (Page Path)",
                cell: ({row}) => (
                    <div className="py-1">
                        <span className="font-mono text-xs text-blue-400 font-medium" dir="ltr">
                            {row.original.page_path}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "device_type",
                header: "نوع الجهاز",
                cell: ({row}) => {
                    const device = row.original.device_type?.toLowerCase();
                    const isMobile = device === "mobile";
                    return (
                        <Badge
                            variant="outline"
                            className={`text-xs border-white/10 flex items-center gap-1.5 w-fit ${
                                isMobile
                                    ? "text-purple-400 bg-purple-500/10"
                                    : "text-blue-400 bg-blue-500/10"
                            }`}>
                            {isMobile ? <Smartphone className="size-3" /> : <Laptop className="size-3" />}
                            <span>{device || "غير معروف"}</span>
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "country",
                header: "الدولة",
                cell: ({row}) => (
                    <span className="text-xs text-slate-300">
                        {row.original.country || "غير محدد"}
                    </span>
                ),
            },
            {
                accessorKey: "referrer",
                header: "المصدر (Referrer)",
                cell: ({row}) => {
                    const ref = row.original.referrer;
                    return (
                        <span
                            className="text-xs text-slate-400 font-mono max-w-[200px] truncate block"
                            dir="ltr"
                            title={ref}>
                            {ref || "Direct (مباشر)"}
                        </span>
                    );
                },
            },
            {
                accessorKey: "session_id",
                header: "معرف الجلسة",
                cell: ({row}) => (
                    <span
                        className="text-[10px] text-slate-500 font-mono max-w-[100px] truncate block"
                        dir="ltr">
                        {row.original.session_id.substring(0, 8)}...
                    </span>
                ),
            },
            {
                accessorKey: "created_at",
                header: "وقت الزيارة",
                cell: ({row}) => (
                    <span className="text-xs text-slate-400">
                        {row.original.created_at
                            ? new Date(row.original.created_at).toLocaleString("ar-EG", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                              })
                            : "—"}
                    </span>
                ),
            },
        ],
        []
    );

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={onPageChange}
        />
    );
}
