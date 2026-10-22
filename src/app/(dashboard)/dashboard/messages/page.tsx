"use client";

import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {ContactMessage} from "@/types/data";
import {useMessages, useDeleteMessage} from "@/hooks/messages/useMessages";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {MessageDetailDialog} from "./MessageDetailDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function MessagesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useMessages({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
    });

    const deleteMutation = useDeleteMessage();

    const messages = data?.results || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<ContactMessage>[] = [
        {
            accessorKey: "name",
            header: "المرسل",
            cell: ({row}) => {
                const item = row.original;
                return (
                    <div className="space-y-0.5 py-1">
                        <span className="font-semibold text-white text-sm block">
                            {item.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono" dir="ltr">
                            {item.email}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "subject",
            header: "الموضوع والرسالة",
            cell: ({row}) => {
                const item = row.original;
                return (
                    <div className="space-y-0.5 max-w-sm">
                        <span className="text-xs font-semibold text-slate-200 block truncate">
                            {item.subject || "بدون موضوع"}
                        </span>
                        <p className="text-xs text-slate-400 truncate">
                            {item.message}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({row}) => (
                <DataTableStatus status={row.original.status} type="message" />
            ),
        },
        {
            accessorKey: "created_at",
            header: "تاريخ الاستلام",
            cell: ({row}) => {
                const d = row.original.created_at;
                return (
                    <span className="text-xs text-slate-400">
                        {d
                            ? new Date(d).toLocaleDateString("ar-EG", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : "—"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: ({row}) => {
                const msg = row.original;
                return (
                    <DataTableActions
                        onView={() => {
                            setSelectedMessage(msg);
                            setIsDetailOpen(true);
                        }}
                        onDelete={() => {
                            setDeletingId(msg.id);
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
                    رسائل التواصل
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    استعراض طلبات التواصل واستفسارات العملاء الواردة من نموذج الموقع
                </p>
            </div>

            <DataTableToolbar
                searchPlaceholder="بحث بالاسم أو البريد أو الموضوع..."
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}>
                <div className="w-36">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}>
                        <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                            <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                            <SelectItem value="all">كل الحالات</SelectItem>
                            <SelectItem value="new">جديدة</SelectItem>
                            <SelectItem value="read">مقروءة</SelectItem>
                            <SelectItem value="replied">تم الرد</SelectItem>
                            <SelectItem value="archived">مؤرشفة</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DataTableToolbar>

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب الرسائل من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={messages}
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

            <MessageDetailDialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                message={selectedMessage}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف الرسالة"
                description="هل أنت متأكد من رغبتك في حذف هذه الرسالة نهائياً؟"
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) deleteMutation.mutate(deletingId);
                }}
            />
        </div>
    );
}
