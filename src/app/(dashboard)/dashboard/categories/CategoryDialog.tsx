"use client";

import {useEffect} from "react";
import {useForm} from "react-hook-form";
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
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Loader2} from "lucide-react";
import {Category} from "@/types/data";
import {createCategory, updateCategory} from "@/services/categories.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToEdit?: Category | null;
}

interface CategoryFormValues {
    name: string;
    slug: string;
    sort_order: number;
    is_active: boolean;
}

export function CategoryDialog({open, onOpenChange, categoryToEdit}: CategoryDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = Boolean(categoryToEdit);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {isSubmitting},
    } = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
            slug: "",
            sort_order: 0,
            is_active: true,
        },
    });

    const isActive = watch("is_active");

    useEffect(() => {
        if (categoryToEdit && open) {
            setValue("name", categoryToEdit.name || "");
            setValue("slug", categoryToEdit.slug || "");
            setValue("sort_order", categoryToEdit.sort_order ?? 0);
            setValue("is_active", categoryToEdit.is_active ?? true);
        } else if (!categoryToEdit && open) {
            reset({
                name: "",
                slug: "",
                sort_order: 0,
                is_active: true,
            });
        }
    }, [categoryToEdit, open, setValue, reset]);

    const mutation = useMutation({
        mutationFn: async (values: CategoryFormValues) => {
            const payload = {
                name: values.name.trim(),
                slug: values.slug.trim(),
                sort_order: Number(values.sort_order),
                is_active: values.is_active,
            };

            if (isEdit && categoryToEdit) {
                return await updateCategory(categoryToEdit.id, payload);
            } else {
                return await createCategory(payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-categories"]});
            queryClient.invalidateQueries({queryKey: ["all-system-categories"]});
            toast.success(isEdit ? "تم تحديث التصنيف بنجاح" : "تم إنشاء التصنيف بنجاح");
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ التصنيف"));
        },
    });

    const onSubmit = (values: CategoryFormValues) => {
        if (!values.name || !values.slug) {
            toast.error("يرجى إدخال اسم التصنيف والرابط المختصر (slug)");
            return;
        }
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEdit ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        تحديد اسم التصنيف المعروض ومساره البرمجي وحالته
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">اسم التصنيف *</Label>
                        <Input
                            {...register("name", {required: true})}
                            placeholder="مثال: تطوير الويب"
                            className="border-white/10 bg-white/5 text-slate-100 text-xs"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">الرابط المختصر (Slug) *</Label>
                        <Input
                            {...register("slug", {required: true})}
                            dir="ltr"
                            placeholder="web-development"
                            className="border-white/10 bg-white/5 text-slate-100 font-mono text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center pt-1">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">الترتيب</Label>
                            <Input
                                {...register("sort_order")}
                                type="number"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <Checkbox
                                id="cat-active"
                                checked={isActive}
                                onCheckedChange={(val) => setValue("is_active", Boolean(val))}
                                className="border-white/20 data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="cat-active" className="text-xs text-slate-300 cursor-pointer">
                                تصنيف نشط
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-start pt-3">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                            {mutation.isPending && <Loader2 className="size-3.5 animate-spin ml-1.5" />}
                            {isEdit ? "حفظ التعديلات" : "إنشاء التصنيف"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs">
                            إلغاء
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
