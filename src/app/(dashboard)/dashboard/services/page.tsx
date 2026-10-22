"use client";

import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Wrench} from "lucide-react";
import {Service} from "@/types/data";
import {useServices, useDeleteService} from "@/hooks/services/useServices";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {ServiceDialog} from "./ServiceDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ServicesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useServices({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteService();

    const services = data?.results || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<Service>[] = [
        {
            accessorKey: "slug",
            header: "الخدمة (Slug)",
            cell: ({row}) => {
                const service = row.original;
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="size-8 rounded-lg bg-cyan-600/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 font-bold text-xs">
                            <Wrench className="size-4" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-white" dir="ltr">
                            {service.slug}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "icon",
            header: "معرّف الأيقونة",
            cell: ({row}) => (
                <span className="text-xs text-slate-400 font-mono" dir="ltr">
                    {row.original.icon || "—"}
                </span>
            ),
        },
        {
            accessorKey: "is_active",
            header: "الحالة",
            cell: ({row}) => (
                <DataTableStatus status={row.original.is_active} type="boolean" />
            ),
        },
        {
            accessorKey: "sort_order",
            header: "الترتيب",
            cell: ({row}) => (
                <span className="text-xs text-slate-300 font-mono">
                    {row.original.sort_order ?? 0}
                </span>
            ),
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: ({row}) => {
                const service = row.original;
                return (
                    <DataTableActions
                        onEdit={() => {
                            setEditingService(service);
                            setIsDialogOpen(true);
                        }}
                        onDelete={() => {
                            setDeletingId(service.id);
                            setIsDeleteDialogOpen(true);
                        }}
                    />
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    إدارة الخدمات
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    إدارة باقات الخدمات والحلول البرمجية المقدمة مع الترجمات
                </p>
            </div>

            <DataTableToolbar
                searchPlaceholder="بحث في الخدمات بالـ slug..."
                buttonText="إضافة خدمة جديدة"
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingService(null);
                    setIsDialogOpen(true);
                }}>
                <div className="w-36">
                    <Select
                        value={activeFilter}
                        onValueChange={(val) => {
                            setActiveFilter(val);
                            setPage(1);
                        }}>
                        <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                            <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="true">نشط</SelectItem>
                            <SelectItem value="false">غير نشط</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DataTableToolbar>

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب الخدمات من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={services}
                isLoading={isLoading}
                pagination={
                    pagination
                        ? {
                              page: pagination.page,
                              totalPages: pagination.totalPages,
                              totalResults: pagination.totalResults,
                          }
                        : undefined
                }
                onPageChange={(p) => setPage(p)}
            />

            <ServiceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                serviceToEdit={editingService}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف الخدمة"
                description="هل أنت متأكد من رغبتك في حذف هذه الخدمة وجميع ترجماتها؟"
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) deleteMutation.mutate(deletingId);
                }}
            />
        </div>
    );
}
