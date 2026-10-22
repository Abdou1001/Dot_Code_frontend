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
import {Loader2, Plus, Star, Trash2, UploadCloud} from "lucide-react";
import Image from "next/image";
import {Project} from "@/types/data";
import {
    getProjectImages,
    uploadProjectImage,
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

    const {data, isLoading} = useQuery({
        queryKey: ["project-images", project?.id],
        queryFn: () => (project ? getProjectImages(project.id) : null),
        enabled: Boolean(project && open),
    });

    const images = data?.results || [];

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

    const deleteMutation = useMutation({
        mutationFn: async (imageId: string) => {
            if (!project) return;
            return await deleteProjectImage(project.id, imageId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-images", project?.id]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم حذف الصورة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف الصورة"));
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        صور ومعرض المشروع: <span className="text-blue-400 font-mono">{project?.slug}</span>
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        إدارة الصور ولقطات الشاشة وتحديد الصورة البارزة في المعرض
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
                    <h4 className="text-xs font-semibold text-slate-300">الصور الحالية ({images.length})</h4>

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
                                    className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center">
                                    <Image
                                        src={img.image_url}
                                        alt={img.alt || "Project Image"}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    {img.is_featured && (
                                        <div className="absolute top-1.5 right-1.5 bg-blue-600/90 text-white p-1 rounded-md text-[10px] flex items-center gap-1 shadow-md">
                                            <Star className="size-3 fill-white" />
                                            <span>رئيسية</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="size-7 rounded-lg"
                                            disabled={deleteMutation.isPending}
                                            onClick={() => deleteMutation.mutate(img.id)}
                                            title="حذف الصورة">
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
