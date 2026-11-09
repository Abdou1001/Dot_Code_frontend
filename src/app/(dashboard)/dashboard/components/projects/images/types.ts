export interface StagedProjectImage {
    id: string;
    file: File;
    previewUrl: string;
    alt: string;
    sort_order: number;
    is_featured: boolean;
    status: "idle" | "uploading" | "success" | "error";
    errorMessage?: string;
}

export interface ExistingProjectImage {
    id: string;
    image_url: string;
    alt?: string;
    sort_order: number;
    is_featured: boolean;
}

export interface UnifiedImageItem {
    id: string;
    isStaged: boolean;
    previewUrl?: string;
    image_url?: string;
    alt: string;
    sort_order: number;
    is_featured: boolean;
    file?: File;
    status?: "idle" | "uploading" | "success" | "error";
    errorMessage?: string;
}

export interface ProjectImagesManagerProps {
    stagedImages: StagedProjectImage[];
    onStagedImagesChange: (images: StagedProjectImage[]) => void;
    existingImages?: ExistingProjectImage[];
    onDeleteExistingImage?: (imageId: string) => Promise<void>;
    onSetExistingFeatured?: (imageId: string) => Promise<void>;
    onUpdateExistingImage?: (
        imageId: string,
        payload: {alt?: string; sort_order?: number; is_featured?: boolean}
    ) => Promise<void>;
    slug?: string;
    disabled?: boolean;
}

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

