"use client";

import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {
    Archive,
    CheckCheck,
    Mail,
    Phone,
    Reply,
    User,
    Calendar,
} from "lucide-react";
import {ContactMessage} from "@/types/data";
import {updateMessageStatus} from "@/services/messages.api";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface MessageDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: ContactMessage | null;
}

export function MessageDetailDialog({open, onOpenChange, message}: MessageDetailDialogProps) {
    const queryClient = useQueryClient();
    const [updatedStatus, setUpdatedStatus] = useState<string | null>(null);

    const statusMutation = useMutation({
        mutationFn: (newStatus: "new" | "read" | "replied" | "archived") => {
            if (!message) throw new Error("No message selected");
            return updateMessageStatus(message.id, newStatus);
        },
        onSuccess: (_, newStatus) => {
            queryClient.invalidateQueries({queryKey: ["dashboard-messages"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-messages-count"]});
            toast.success("تم تحديث حالة الرسالة");
            setUpdatedStatus(newStatus);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث حالة الرسالة"));
        },
    });

    if (!message) return null;

    const formattedDate = message.created_at
        ? new Date(message.created_at).toLocaleString("ar-EG", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "—";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-white">
                            تفاصيل رسالة التواصل
                        </DialogTitle>
                        <DataTableStatus status={updatedStatus || message.status} type="message" />
                    </div>
                    <DialogDescription className="text-slate-400 text-xs">
                        بيانات المرسل وتفاصيل الرسالة المرسلة عبر نموذج الموقع
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Sender Info Card */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-semibold">
                                <User className="size-4 text-blue-400" />
                                <span className="text-sm">{message.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <Calendar className="size-3.5" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5 text-slate-300">
                            <a
                                href={`mailto:${message.email}`}
                                className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                                dir="ltr">
                                <Mail className="size-3.5 text-slate-400" />
                                <span>{message.email}</span>
                            </a>
                            {message.phone && (
                                <a
                                    href={`tel:${message.phone}`}
                                    className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                                    dir="ltr">
                                    <Phone className="size-3.5 text-slate-400" />
                                    <span>{message.phone}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Subject & Message Body */}
                    <div className="space-y-2">
                        <span className="text-xs text-slate-400 block">الموضوع:</span>
                        <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-white font-medium text-xs">
                            {message.subject || "بدون موضوع"}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-slate-400 block">نص الرسالة:</span>
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap min-h-[120px]">
                            {message.message}
                        </div>
                    </div>

                    {/* Quick Status Update Actions */}
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-2">
                        <span className="text-[11px] text-slate-400 font-semibold block">
                            تحديث حالة الرسالة:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={statusMutation.isPending || message.status === "read"}
                                onClick={() => statusMutation.mutate("read")}
                                className="text-xs border-white/10 bg-white/5 hover:bg-blue-600/20 hover:text-blue-300">
                                <CheckCheck className="size-3.5 ml-1" />
                                تمييز كمقروءة
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={statusMutation.isPending || message.status === "replied"}
                                onClick={() => statusMutation.mutate("replied")}
                                className="text-xs border-white/10 bg-white/5 hover:bg-emerald-600/20 hover:text-emerald-300">
                                <Reply className="size-3.5 ml-1" />
                                تم الرد عليها
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={statusMutation.isPending || message.status === "archived"}
                                onClick={() => statusMutation.mutate("archived")}
                                className="text-xs border-white/10 bg-white/5 hover:bg-purple-600/20 hover:text-purple-300">
                                <Archive className="size-3.5 ml-1" />
                                أرشفة
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:justify-between pt-2">
                    <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                        <a
                            href={`mailto:${message.email}?subject=رد على: ${encodeURIComponent(
                                message.subject || "رسالتك إلى Dot Code"
                            )}`}>
                            <Reply className="size-3.5 ml-1.5" />
                            الرد بالبريد الإلكتروني
                        </a>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs">
                        إغلاق
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
