"use client";

import {useState, useRef, useEffect, useMemo, ChangeEvent} from "react";
import {toast} from "sonner";
import {
    StagedProjectImage,
    ExistingProjectImage,
    UnifiedImageItem,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE_BYTES,
} from "./types";

interface UseProjectImagesManagerParams {
    stagedImages: StagedProjectImage[];
    onStagedImagesChange: (images: StagedProjectImage[]) => void;
    existingImages?: ExistingProjectImage[];
    onDeleteExistingImage?: (imageId: string) => Promise<void>;
    onUpdateExistingImage?: (
        imageId: string,
        payload: {alt?: string; sort_order?: number; is_featured?: boolean}
    ) => Promise<void>;
}

export function useProjectImagesManager({
    stagedImages,
    onStagedImagesChange,
    existingImages = [],
    onDeleteExistingImage,
    onUpdateExistingImage,
}: UseProjectImagesManagerParams) {
    // Form state for "رفع صورة جديدة"
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
    const [pendingAlt, setPendingAlt] = useState("");
    const [pendingIsFeatured, setPendingIsFeatured] = useState(false);

    // Selected image for Enlarged View & Edit
    const [selectedImage, setSelectedImage] = useState<UnifiedImageItem | null>(null);
    const [editAlt, setEditAlt] = useState("");
    const [editSortOrder, setEditSortOrder] = useState<number>(0);
    const [editIsFeatured, setEditIsFeatured] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const createdUrlsRef = useRef<Set<string>>(new Set());

    // Clean up created object URLs on unmount
    useEffect(() => {
        const urlsToRevoke = createdUrlsRef.current;
        return () => {
            urlsToRevoke.forEach((url) => {
                try {
                    URL.revokeObjectURL(url);
                } catch {}
            });
        };
    }, []);

    // Combine staged and existing images into unified list for the gallery
    const unifiedImages = useMemo<UnifiedImageItem[]>(() => {
        const existing: UnifiedImageItem[] = existingImages.map((img) => ({
            id: img.id,
            isStaged: false,
            image_url: img.image_url,
            alt: img.alt || "",
            sort_order: img.sort_order ?? 0,
            is_featured: Boolean(img.is_featured),
        }));

        const staged: UnifiedImageItem[] = stagedImages.map((img) => ({
            id: img.id,
            isStaged: true,
            previewUrl: img.previewUrl,
            alt: img.alt || "",
            sort_order: img.sort_order ?? 0,
            is_featured: Boolean(img.is_featured),
            file: img.file,
            status: img.status,
            errorMessage: img.errorMessage,
        }));

        return [...existing, ...staged].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }, [existingImages, stagedImages]);

    // Handle file selection from the picker
    const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validate MIME
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            toast.error(`الملف "${file.name}" غير مدعوم. الصيغ المدعومة هي: JPEG, PNG, WebP فقط.`);
            return;
        }

        // 2. Validate Size
        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast.error(`الملف "${file.name}" يتجاوز الحد الأقصى المسموح به (5 ميجابايت).`);
            return;
        }

        // Revoke previous pending preview if any
        if (pendingPreviewUrl) {
            try {
                URL.revokeObjectURL(pendingPreviewUrl);
                createdUrlsRef.current.delete(pendingPreviewUrl);
            } catch {}
        }

        const previewUrl = URL.createObjectURL(file);
        createdUrlsRef.current.add(previewUrl);

        setPendingFile(file);
        setPendingPreviewUrl(previewUrl);

        // Pre-fill alt text if empty
        if (!pendingAlt.trim()) {
            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            setPendingAlt(cleanName);
        }

        // Default to featured if no image is featured yet
        const hasFeatured = unifiedImages.some((img) => img.is_featured);
        if (!hasFeatured) {
            setPendingIsFeatured(true);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Add image to staged list (Matching "+ رفع الصورة" button)
    const handleAddImage = () => {
        if (!pendingFile || !pendingPreviewUrl) {
            toast.error("يرجى اختيار ملف صورة أولاً");
            return;
        }

        const willBeFeatured = pendingIsFeatured;

        let updatedStaged = stagedImages;
        if (willBeFeatured) {
            updatedStaged = stagedImages.map((img) => ({...img, is_featured: false}));
        }

        const newStagedItem: StagedProjectImage = {
            id: `staged-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file: pendingFile,
            previewUrl: pendingPreviewUrl,
            alt: pendingAlt.trim(),
            sort_order: unifiedImages.length,
            is_featured: willBeFeatured,
            status: "idle",
        };

        onStagedImagesChange([...updatedStaged, newStagedItem]);
        toast.success("تمت إضافة الصورة بنجاح");

        // Reset form
        setPendingFile(null);
        setPendingPreviewUrl(null);
        setPendingAlt("");
        setPendingIsFeatured(false);
    };

    // Select image for Enlarged View
    const handleSelectImage = (img: UnifiedImageItem) => {
        setSelectedImage(img);
        setEditAlt(img.alt || "");
        setEditSortOrder(img.sort_order ?? 0);
        setEditIsFeatured(Boolean(img.is_featured));
    };

    const currentIndex = selectedImage
        ? unifiedImages.findIndex((img) => img.id === selectedImage.id)
        : -1;

    const handlePrevImage = () => {
        if (currentIndex > 0) {
            handleSelectImage(unifiedImages[currentIndex - 1]);
        }
    };

    const handleNextImage = () => {
        if (currentIndex >= 0 && currentIndex < unifiedImages.length - 1) {
            handleSelectImage(unifiedImages[currentIndex + 1]);
        }
    };

    // Save Edits for the selected image
    const handleSaveImageEdits = async () => {
        if (!selectedImage) return;

        if (selectedImage.isStaged) {
            // Update staged image
            onStagedImagesChange(
                stagedImages.map((img) => {
                    if (img.id === selectedImage.id) {
                        return {
                            ...img,
                            alt: editAlt.trim(),
                            sort_order: Number(editSortOrder) || 0,
                            is_featured: editIsFeatured,
                        };
                    }
                    if (editIsFeatured) {
                        return {...img, is_featured: false};
                    }
                    return img;
                })
            );
            toast.success("تم تحديث بيانات الصورة");
            setSelectedImage(null);
        } else {
            // Update existing image on server
            if (onUpdateExistingImage) {
                await onUpdateExistingImage(selectedImage.id, {
                    alt: editAlt.trim(),
                    sort_order: Number(editSortOrder) || 0,
                    is_featured: editIsFeatured,
                });
                setSelectedImage(null);
            }
        }
    };

    // Delete image (staged or existing)
    const handleDeleteUnifiedImage = async (imageId: string) => {
        const target = unifiedImages.find((img) => img.id === imageId);
        if (!target) return;

        if (target.isStaged) {
            if (target.previewUrl) {
                try {
                    URL.revokeObjectURL(target.previewUrl);
                    createdUrlsRef.current.delete(target.previewUrl);
                } catch {}
            }
            onStagedImagesChange(stagedImages.filter((img) => img.id !== imageId));
            toast.success("تم حذف الصورة بنجاح");
        } else if (onDeleteExistingImage) {
            await onDeleteExistingImage(imageId);
        }

        if (selectedImage?.id === imageId) {
            setSelectedImage(null);
        }
    };

    const handleCloseEdit = () => {
        setSelectedImage(null);
    };

    return {
        // Pending upload state
        pendingFile,
        pendingPreviewUrl,
        pendingAlt,
        setPendingAlt,
        pendingIsFeatured,
        setPendingIsFeatured,
        fileInputRef,

        // Gallery & selected state
        unifiedImages,
        selectedImage,
        currentIndex,
        editAlt,
        setEditAlt,
        editSortOrder,
        setEditSortOrder,
        editIsFeatured,
        setEditIsFeatured,

        // Handlers
        handleFileSelected,
        handleAddImage,
        handleSelectImage,
        handlePrevImage,
        handleNextImage,
        handleSaveImageEdits,
        handleDeleteUnifiedImage,
        handleCloseEdit,
    };
}

