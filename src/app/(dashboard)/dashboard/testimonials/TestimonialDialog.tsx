"use client";

import {useState, useEffect} from "react";
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
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Loader2, Star, UploadCloud} from "lucide-react";
import Image from "next/image";
import {Testimonial} from "@/types/data";
import {createTestimonial, updateTestimonial} from "@/services/testimonials.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface TestimonialDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonialToEdit?: Testimonial | null;
}

interface TestimonialFormValues {
    client_name: string;
    client_role: string;
    company: string;
    rating: number;
    testimonial: string;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
}

export function TestimonialDialog({open, onOpenChange, testimonialToEdit}: TestimonialDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = Boolean(testimonialToEdit);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {isSubmitting},
    } = useForm<TestimonialFormValues>({
        defaultValues: {
            client_name: "",
            client_role: "",
            company: "",
            rating: 5,
            testimonial: "",
            is_featured: false,
            is_published: true,
            sort_order: 0,
        },
    });

    const currentRating = watch("rating");
    const isFeatured = watch("is_featured");
    const isPublished = watch("is_published");

    useEffect(() => {
        if (testimonialToEdit && open) {
            setValue("client_name", testimonialToEdit.client_name || "");
            setValue("client_role", testimonialToEdit.client_role || "");
            setValue("company", testimonialToEdit.company || "");
            setValue("rating", testimonialToEdit.rating ?? 5);
            setValue("testimonial", testimonialToEdit.testimonial || "");
            setValue("is_featured", testimonialToEdit.is_featured ?? false);
            setValue("is_published", testimonialToEdit.is_published ?? true);
            setValue("sort_order", testimonialToEdit.sort_order ?? 0);
            setPreviewUrl(testimonialToEdit.client_image_url || null);
            setSelectedFile(null);
        } else if (!testimonialToEdit && open) {
            reset({
                client_name: "",
                client_role: "",
                company: "",
                rating: 5,
                testimonial: "",
                is_featured: false,
                is_published: true,
                sort_order: 0,
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [testimonialToEdit, open, setValue, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const mutation = useMutation({
        mutationFn: async (values: TestimonialFormValues) => {
            const formData = new FormData();
            formData.append("client_name", values.client_name.trim());
            if (values.client_role) formData.append("client_role", values.client_role.trim());
            if (values.company) formData.append("company", values.company.trim());
            formData.append("rating", String(values.rating));
            formData.append("testimonial", values.testimonial.trim());
            formData.append("is_featured", values.is_featured ? "true" : "false");
            formData.append("is_published", values.is_published ? "true" : "false");
            formData.append("sort_order", String(values.sort_order));

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            if (isEdit && testimonialToEdit) {
                return await updateTestimonial(testimonialToEdit.id, formData);
            } else {
                return await createTestimonial(formData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials-count"]});
            toast.success(isEdit ? "تم تحديث التقييم بنجاح" : "تمت إضافة التقييم بنجاح");
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ التقييم"));
        },
    });

    const onSubmit = (values: TestimonialFormValues) => {
        if (!values.client_name || !values.testimonial) {
            toast.error("يرجى إدخال اسم العميل ونص التقييم");
            return;
        }
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEdit ? "تعديل رأي العميل" : "إضافة رأي عميل جديد"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        تسجيل تقييم العميل ورأيه بالخدمة مع صورته والتقييم بالنجوم
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/5">
                        <label className="relative flex flex-col items-center justify-center size-16 rounded-full border border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer overflow-hidden shrink-0">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <UploadCloud className="size-5 text-blue-400" />
                            )}
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <div>
                            <span className="text-xs font-semibold text-white block">صورة العميل (اختياري)</span>
                            <span className="text-[11px] text-slate-400">انقر لاختيار صورة شخصية أو شعار الشركة</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">اسم العميل *</Label>
                            <Input
                                {...register("client_name", {required: true})}
                                placeholder="مثال: أحمد المنصوري"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">المسمى الوظيفي (Role)</Label>
                            <Input
                                {...register("client_role")}
                                placeholder="مثال: الرئيس التنفيذي"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">اسم الشركة</Label>
                            <Input
                                {...register("company")}
                                placeholder="مثال: شركة الرواد التقنية"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">التقييم (1 - 5 نجوم)</Label>
                            <div className="flex items-center gap-1.5 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setValue("rating", star)}
                                        className="p-1 rounded hover:scale-110 transition-transform">
                                        <Star
                                            className={`size-5 ${
                                                star <= (currentRating || 5)
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-slate-600"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">نص التقييم والتوصية *</Label>
                        <Textarea
                            {...register("testimonial", {required: true})}
                            rows={3}
                            placeholder="تجربتي مع Dot Code كانت ممتازة..."
                            className="border-white/10 bg-white/5 text-slate-100 text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center pt-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="test-pub"
                                checked={isPublished}
                                onCheckedChange={(val) => setValue("is_published", Boolean(val))}
                                className="border-white/20 data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="test-pub" className="text-xs text-slate-300 cursor-pointer">
                                منشور بالموقع
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="test-feat"
                                checked={isFeatured}
                                onCheckedChange={(val) => setValue("is_featured", Boolean(val))}
                                className="border-white/20 data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="test-feat" className="text-xs text-slate-300 cursor-pointer">
                                تقييم مميز
                            </Label>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[11px] text-slate-400">الترتيب</Label>
                            <Input
                                {...register("sort_order")}
                                type="number"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs h-8"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-start pt-3">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                            {mutation.isPending && <Loader2 className="size-3.5 animate-spin ml-1.5" />}
                            {isEdit ? "حفظ التعديلات" : "إضافة التقييم"}
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
