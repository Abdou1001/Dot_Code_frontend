"use client";

import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Code2} from "lucide-react";
import {Technology} from "@/types/data";
import {useTechnologies, useDeleteTechnology} from "@/hooks/technologies/useTechnologies";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {TechnologyDialog} from "./TechnologyDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TechnologiesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useTechnologies({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteTechnology();

    const technologies = data?.results || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<Technology>[] = [
        {
            accessorKey: "name",
            header: "التقنية",
            cell: ({row}) => {
                const tech = row.original;
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="size-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 font-bold text-xs">
                            <Code2 className="size-4" />
                        </div>
                        <span className="font-semibold text-white text-sm">
                            {tech.name}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "slug",
            header: "الرابط المختصر (Slug)",
            cell: ({row}) => (
                <span className="font-mono text-xs text-blue-400" dir="ltr">
                    {row.original.slug}
                </span>
            ),
        },
        {
            accessorKey: "icon",
            header: "الأيقونة",
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
                const tech = row.original;
                return (
                    <DataTableActions
                        onEdit={() => {
                            setEditingTechnology(tech);
                            setIsDialogOpen(true);
                        }}
                        onDelete={() => {
                            setDeletingId(tech.id);
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
                    إدارة التقنيات
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    إدارة المهارات ومكتبات ولغات البرمجة المستخدمة في معرض Dot Code
                </p>
            </div>

            <DataTableToolbar
                searchPlaceholder="بحث في التقنيات بالاسم أو الـ slug..."
                buttonText="إضافة تقنية جديدة"
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingTechnology(null);
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
                    <span>تعذر جلب التقنيات من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={technologies}
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

            <TechnologyDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                technologyToEdit={editingTechnology}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف التقنية"
                description="هل أنت متأكد من رغبتك في حذف هذه التقنية؟"
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) deleteMutation.mutate(deletingId);
                }}
            />
        </div>
    );
}
