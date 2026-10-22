"use client";

import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Star, User} from "lucide-react";
import Image from "next/image";
import {Testimonial} from "@/types/data";
import {useTestimonials, useDeleteTestimonial} from "@/hooks/testimonials/useTestimonials";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {TestimonialDialog} from "./TestimonialDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TestimonialsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [publishedFilter, setPublishedFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useTestimonials({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_published:
            publishedFilter === "all"
                ? undefined
                : (publishedFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteTestimonial();

    const testimonials = data?.results || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<Testimonial>[] = [
        {
            accessorKey: "client_name",
            header: "العميل",
            cell: ({row}) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="relative size-10 rounded-full overflow-hidden bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                            {item.client_image_url ? (
                                <Image
                                    src={item.client_image_url}
                                    alt={item.client_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="size-5 text-blue-400" />
                            )}
                        </div>
                        <div>
                            <span className="font-semibold text-white text-sm block">
                                {item.client_name}
                            </span>
                            <span className="text-xs text-slate-400">
                                {item.client_role || ""}{item.client_role && item.company ? " - " : ""}{item.company || ""}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "rating",
            header: "التقييم",
            cell: ({row}) => {
                const rating = row.original.rating ?? 5;
                return (
                    <div className="flex items-center gap-1">
                        {Array.from({length: 5}).map((_, i) => (
                            <Star
                                key={i}
                                className={`size-3.5 ${
                                    i < rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-slate-600"
                                }`}
                            />
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "testimonial",
            header: "نص التقييم",
            cell: ({row}) => (
                <p className="text-xs text-slate-300 max-w-xs truncate" title={row.original.testimonial}>
                    {row.original.testimonial}
                </p>
            ),
        },
        {
            accessorKey: "is_published",
            header: "الحالة",
            cell: ({row}) => (
                <DataTableStatus status={row.original.is_published} type="boolean" />
            ),
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: ({row}) => {
                const item = row.original;
                return (
                    <DataTableActions
                        onEdit={() => {
                            setEditingTestimonial(item);
                            setIsDialogOpen(true);
                        }}
                        onDelete={() => {
                            setDeletingId(item.id);
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
                    آراء وتوصيات العملاء
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    إدارة تقييمات العملاء وشهادات الثقة المعروضة في موقع Dot Code
                </p>
            </div>

            <DataTableToolbar
                searchPlaceholder="بحث في التقييمات باسم العميل أو الشركة..."
                buttonText="إضافة رأي عميل"
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingTestimonial(null);
                    setIsDialogOpen(true);
                }}>
                <div className="w-36">
                    <Select
                        value={publishedFilter}
                        onValueChange={(val) => {
                            setPublishedFilter(val);
                            setPage(1);
                        }}>
                        <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                            <SelectValue placeholder="تصفية بالنشر" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="true">منشور</SelectItem>
                            <SelectItem value="false">غير منشور</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DataTableToolbar>

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب آراء العملاء من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={testimonials}
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

            <TestimonialDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                testimonialToEdit={editingTestimonial}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف رأي العميل"
                description="هل أنت متأكد من رغبتك في حذف هذا التقييم نهائياً؟"
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) deleteMutation.mutate(deletingId);
                }}
            />
        </div>
    );
}
