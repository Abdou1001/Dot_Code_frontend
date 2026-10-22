"use client";

import {useCurrentUser} from "@/hooks/auth/useCurrentUser";
import {useLogout} from "@/hooks/auth/useLogout";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Calendar,
    CheckCircle2,
    Info,
    KeyRound,
    LogOut,
    Mail,
    Shield,
    User as UserIcon,
} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

export default function AccountPage() {
    const {data: user, isLoading, isError, refetch} = useCurrentUser();
    const logout = useLogout();

    const initials = user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "DC";

    const formattedCreatedAt = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "—";

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    بيانات حساب المسؤول
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    استعراض هوية وصلاحيات حساب المدير المعتمد الحالي في لوحة تحكم Dot Code
                </p>
            </div>

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر استرجاع بيانات الحساب من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            {/* Profile Overview Card */}
            <div className="vision-card rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,117,255,0.4)]">
                            <AvatarFallback className="rounded-2xl bg-transparent text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-36 bg-white/10" />
                            ) : (
                                <h3 className="text-lg font-bold text-white">
                                    {user?.full_name || "المدير"}
                                </h3>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-[11px] flex items-center gap-1">
                                    <Shield className="size-3" />
                                    <span>{user?.role === "admin" ? "مدير النظام (Admin)" : user?.role}</span>
                                </Badge>
                                {user?.is_active && (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[11px] flex items-center gap-1">
                                        <CheckCircle2 className="size-3" />
                                        <span>الحساب نشط</span>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={logout.isPending}
                        onClick={() => logout.mutate()}
                        className="bg-red-600/80 hover:bg-red-600 text-white text-xs">
                        <LogOut className="size-3.5 ml-1.5" />
                        تسجيل الخروج
                    </Button>
                </div>

                {/* Account Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
                    <div className="space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <Mail className="size-3.5 text-blue-400" />
                            <span>البريد الإلكتروني المعتمد:</span>
                        </span>
                        <p className="text-white font-mono text-sm" dir="ltr">
                            {isLoading ? "..." : user?.email}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-purple-400" />
                            <span>تاريخ إنشاء الحساب:</span>
                        </span>
                        <p className="text-white text-sm">
                            {isLoading ? "..." : formattedCreatedAt}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <UserIcon className="size-3.5 text-cyan-400" />
                            <span>معرّف المستخدم (User ID):</span>
                        </span>
                        <p className="text-slate-300 font-mono text-[11px] truncate" dir="ltr">
                            {isLoading ? "..." : user?.id}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <KeyRound className="size-3.5 text-amber-400" />
                            <span>نوع الجلسة:</span>
                        </span>
                        <p className="text-emerald-400 text-xs font-semibold">
                            JWT Cookie Session (7 Days)
                        </p>
                    </div>
                </div>
            </div>

            {/* API Capability Notice Card */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3 text-xs text-slate-300">
                <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                    <span className="font-semibold text-white block">ملاحظة أمان وتكامل API:</span>
                    <p className="text-slate-400">
                        البيانات المعروضة أعلاه مسترجعة مباشرة من نقطة نهاية <code className="text-blue-400">GET /api/auth/me</code>. وفقاً لوثيقة تكامل Backend، لا تتوفر نقطة نهاية لتعديل الاسم أو كلمة المرور مباشرة بدون كود تحقق، وتغيير كلمة المرور متاح فقط عبر تدفق OTP للبريد الإلكتروني المسجل.
                    </p>
                </div>
            </div>
        </div>
    );
}
