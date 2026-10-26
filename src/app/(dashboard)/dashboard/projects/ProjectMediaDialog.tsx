"use client";

import {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Skeleton} from "@/components/ui/skeleton";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Loader2,
    Maximize2,
    Plus,
    Save,
    Star,
    Trash2,
    UploadCloud,
} from "lucide-react";
import Image from "next/image";
import {Project, ProjectImage} from "@/types/data";
import {
    getProjectImages,
    uploadProjectImage,
    updateProjectImage,
    deleteProjectImage,
} from "@/services/projects.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface ProjectMediaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
}

export function ProjectMediaDialog({open, onOpenChange, project}: ProjectMediaDialogProps) {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [altText, setAltText] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Selected image for enlarged preview & edit
    const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
    const [editAlt, setEditAlt] = useState("");
    const [editSortOrder, setEditSortOrder] = useState<number>(0);
    const [editIsFeatured, setEditIsFeatured] = useState(false);

    const {data, isLoading} = useQuery({
        queryKey: ["project-images", project?.id],
        queryFn: () => (project ? getProjectImages(project.id) : null),
        enabled: Boolean(project && open),
    });

    const images = data?.results || [];

    const handleSelectImage = (img: ProjectImage) => {
        setSelectedImage(img);
        setEditAlt(img.alt || "");
        setEditSortOrder(img.sort_order ?? 0);
        setEditIsFeatured(Boolean(img.is_featured));
    };

    const currentIndex = selectedImage ? images.findIndex((img) => img.id === selectedImage.id) : -1;

    const handlePrevImage = () => {
        if (currentIndex > 0) {
            handleSelectImage(images[currentIndex - 1]);
        }
    };

    const handleNextImage = () => {
        if (currentIndex >= 0 && currentIndex < images.length - 1) {
            handleSelectImage(images[currentIndex + 1]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!project || !selectedFile) return;
            const formData = new FormData();
            formData.append("image", selectedFile);
            if (altText) formData.append("alt", altText);
            formData.append("is_featured", isFeatured ? "true" : "false");

            return await uploadProjectImage(project.id, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-images", project?.id]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم رفع الصورة بنجاح");
            setSelectedFile(null);
            setPreviewUrl(null);
            setAltText("");
            setIsFeatured(false);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل رفع الصورة"));
        },
    });

    const updateMutation = useMutation({
        mutationFn: async () => {
            if (!project || !selectedImage) return;
            return await updateProjectImage(project.id, selectedImage.id, {
                alt: editAlt.trim(),
                sort_order: Number(editSortOrder) || 0,
                is_featured: editIsFeatured,
            });
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ["project-images", project?.id]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم تحديث بيانات الصورة بنجاح");
            if (res?.results) {
                handleSelectImage(res.results);
            }
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث بيانات الصورة"));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (imageId: string) => {
            if (!project) return;
            return await deleteProjectImage(project.id, imageId);
        },
        onSuccess: (_data, imageId) => {
            queryClient.invalidateQueries({queryKey: ["project-images", project?.id]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم حذف الصورة بنجاح");
            if (selectedImage?.id === imageId) {
                setSelectedImage(null);
            }
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف الصورة"));
        },
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) setSelectedImage(null);
                onOpenChange(val);
            }}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-3xl max-h-[88vh] overflow-y-auto">
                {selectedImage ? (
                    /* Enlarged Image & Edit Section */
                    <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Header & Navigation */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedImage(null)}
                                    className="text-slate-300 hover:text-white hover:bg-white/10 text-xs gap-1">
                                    <ArrowRight className="size-4" />
                                    <span>الرجوع للمعرض</span>
                                </Button>
                                <span className="text-slate-500">|</span>
                                <span className="text-xs text-slate-400 font-medium">
                                    معاينة وتعديل الصورة ({currentIndex + 1} من {images.length})
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={currentIndex <= 0}
                                    onClick={handlePrevImage}
                                    title="الصورة السابقة"
                                    className="size-7 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                                    <ChevronRight className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={currentIndex < 0 || currentIndex >= images.length - 1}
                                    onClick={handleNextImage}
                                    title="الصورة التالية"
                                    className="size-7 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                                    <ChevronLeft className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Large Preview */}
                        <div className="relative w-full h-72 sm:h-84 md:h-96 rounded-xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center group">
                            <Image
                                src={selectedImage.image_url}
                                alt={selectedImage.alt || "Project Image"}
                                fill
                                sizes="(max-width: 768px) 100vw, 800px"
                                priority
                                className="object-contain"
                            />

                            {/* Top Badges */}
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                {selectedImage.is_featured && (
                                    <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-1 shadow-lg">
                                        <Star className="size-3 fill-white" />
                                        صورة رئيسية
                                    </span>
                                )}
                                <span className="bg-black/60 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-md text-xs border border-white/10">
                                    الترتيب: {selectedImage.sort_order}
                                </span>
                            </div>

                            {/* Open Original Link */}
                            <a
                                href={selectedImage.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-3 left-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-slate-200 hover:text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 border border-white/15 transition-all opacity-80 hover:opacity-100">
                                <ExternalLink className="size-3.5" />
                                <span>عرض بالحجم الكامل</span>
                            </a>
                        </div>

                        {/* Edit Form */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Save className="size-4 text-blue-400" />
                                تعديل بيانات الصورة
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Alt Text */}
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="edit-alt" className="text-xs text-slate-300">
                                        النص التوضيحي (Alt text)
                                    </Label>
                                    <Input
                                        id="edit-alt"
                                        value={editAlt}
                                        onChange={(e) => setEditAlt(e.target.value)}
                                        placeholder="مثال: Hospital management dashboard"
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-sort-order" className="text-xs text-slate-300">
                                        الترتيب (Sort Order)
                                    </Label>
                                    <Input
                                        id="edit-sort-order"
                                        type="number"
                                        min={0}
                                        value={editSortOrder}
                                        onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)}
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-2 pt-1">
                                <Checkbox
                                    id="edit-featured"
                                    checked={editIsFeatured}
                                    onCheckedChange={(val) => setEditIsFeatured(Boolean(val))}
                                    className="border-white/20 data-[state=checked]:bg-blue-600"
                                />
                                <Label htmlFor="edit-featured" className="text-xs text-slate-300 cursor-pointer">
                                    تعيين كصورة رئيسية للمشروع (Featured)
                                </Label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={deleteMutation.isPending}
                                    onClick={() => deleteMutation.mutate(selectedImage.id)}
                                    className="text-xs gap-1.5">
                                    {deleteMutation.isPending ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-3.5" />
                                    )}
                                    حذف الصورة
                                </Button>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedImage(null)}
                                        className="text-xs text-slate-400 hover:text-white">
                                        إلغاء
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={updateMutation.isPending}
                                        onClick={() => updateMutation.mutate()}
                                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5">
                                        {updateMutation.isPending && (
                                            <Loader2 className="size-3.5 animate-spin ml-1" />
                                        )}
                                        <Save className="size-3.5" />
                                        حفظ التعديلات
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Default Gallery & Upload View */
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-white">
                                صور ومعرض المشروع: <span className="text-blue-400 font-mono">{project?.slug}</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-xs">
                                إدارة الصور ولقطات الشاشة وتحديد الصورة البارزة في المعرض (انقر على أي صورة لتكبيرها وتعديلها)
                            </DialogDescription>
                        </DialogHeader>

                        {/* Upload Section */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                            <h4 className="text-xs font-semibold text-white">رفع صورة جديدة</h4>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <label className="relative flex flex-col items-center justify-center size-24 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer overflow-hidden shrink-0">
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 text-[10px]">
                                            <UploadCloud className="size-6 text-blue-400 mb-1" />
                                            <span>اختر ملف</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>

                                <div className="flex-1 space-y-2 w-full">
                                    <Input
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        placeholder="نص توضيحي للصورة (Alt text)..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="media-featured"
                                                checked={isFeatured}
                                                onCheckedChange={(val) => setIsFeatured(Boolean(val))}
                                                className="border-white/20 data-[state=checked]:bg-blue-600"
                                            />
                                            <Label htmlFor="media-featured" className="text-xs text-slate-300 cursor-pointer">
                                                تعيين كصورة رئيسية للمشروع
                                            </Label>
                                        </div>

                                        <Button
                                            size="sm"
                                            disabled={!selectedFile || uploadMutation.isPending}
                                            onClick={() => uploadMutation.mutate()}
                                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                                            {uploadMutation.isPending && <Loader2 className="size-3.5 animate-spin ml-1.5" />}
                                            <Plus className="size-3.5 ml-1" />
                                            رفع الصورة
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Existing Images Gallery */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold text-slate-300">الصور الحالية ({images.length})</h4>
                                <span className="text-[11px] text-slate-400">انقر على أي صورة لتكبيرها وتعديلها</span>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {Array.from({length: 3}).map((_, i) => (
                                        <Skeleton key={i} className="h-28 w-full rounded-xl bg-white/5" />
                                    ))}
                                </div>
                            ) : images.length === 0 ? (
                                <p className="text-xs text-slate-500 py-6 text-center">لا توجد صور مرفوعة لهذا المشروع بعد.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {images.map((img) => (
                                        <div
                                            key={img.id}
                                            onClick={() => handleSelectImage(img)}
                                            className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                                            <Image
                                                src={img.image_url}
                                                alt={img.alt || "Project Image"}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />

                                            {/* Badges */}
                                            {img.is_featured && (
                                                <div className="absolute top-1.5 right-1.5 bg-blue-600/90 text-white p-1 rounded-md text-[10px] flex items-center gap-1 shadow-md z-10">
                                                    <Star className="size-3 fill-white" />
                                                    <span>رئيسية</span>
                                                </div>
                                            )}

                                            <div className="absolute top-1.5 left-1.5 bg-black/60 text-slate-300 px-1.5 py-0.5 rounded text-[10px] border border-white/10 z-10">
                                                #{img.sort_order}
                                            </div>

                                            {/* Hover Actions Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="size-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white p-0"
                                                    title="تكبير وتعديل الصورة">
                                                    <Maximize2 className="size-4" />
                                                </Button>

                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="size-8 rounded-lg p-0"
                                                    disabled={deleteMutation.isPending}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteMutation.mutate(img.id);
                                                    }}
                                                    title="حذف الصورة">
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
