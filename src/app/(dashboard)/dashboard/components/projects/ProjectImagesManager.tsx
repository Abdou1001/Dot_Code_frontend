"use client";

import React from "react";
import {
    ProjectImagesManagerProps,
    useProjectImagesManager,
    ProjectImagesUploadCard,
    ProjectImagesGallery,
    ProjectImageEditView,
} from "./images";

export type {StagedProjectImage, ExistingProjectImage, ProjectImagesManagerProps} from "./images";

export function ProjectImagesManager({
    stagedImages,
    onStagedImagesChange,
    existingImages = [],
    onDeleteExistingImage,
    onUpdateExistingImage,
    slug,
    disabled = false,
}: ProjectImagesManagerProps) {
    const {
        pendingFile,
        pendingPreviewUrl,
        pendingAlt,
        setPendingAlt,
        pendingIsFeatured,
        setPendingIsFeatured,
        fileInputRef,
        unifiedImages,
        selectedImage,
        currentIndex,
        editAlt,
        setEditAlt,
        editSortOrder,
        setEditSortOrder,
        editIsFeatured,
        setEditIsFeatured,
        handleFileSelected,
        handleAddImage,
        handleSelectImage,
        handlePrevImage,
        handleNextImage,
        handleSaveImageEdits,
        handleDeleteUnifiedImage,
        handleCloseEdit,
    } = useProjectImagesManager({
        stagedImages,
        onStagedImagesChange,
        existingImages,
        onDeleteExistingImage,
        onUpdateExistingImage,
    });

    return (
        <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
            {selectedImage ? (
                /* Enlarged Image & Edit Section */
                <ProjectImageEditView
                    image={selectedImage}
                    currentIndex={currentIndex}
                    totalCount={unifiedImages.length}
                    editAlt={editAlt}
                    onEditAltChange={setEditAlt}
                    editSortOrder={editSortOrder}
                    onEditSortOrderChange={setEditSortOrder}
                    editIsFeatured={editIsFeatured}
                    onEditFeaturedChange={setEditIsFeatured}
                    onPrevImage={handlePrevImage}
                    onNextImage={handleNextImage}
                    onSave={handleSaveImageEdits}
                    onDelete={handleDeleteUnifiedImage}
                    onClose={handleCloseEdit}
                />
            ) : (
                /* Default Gallery & Upload View (Matches Screenshot Design) */
                <>
                    {/* Header */}
                    <div className="space-y-1 pb-1">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>صور ومعرض المشروع:</span>
                            {slug && <span className="text-blue-400 font-mono text-xs">{slug}</span>}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            إدارة الصور ولقطات الشاشة وتحديد الصورة البارزة في المعرض (انقر على أي صورة لتكبيرها وتعديلها)
                        </p>
                    </div>

                    {/* Upload Section - "رفع صورة جديدة" Card */}
                    <ProjectImagesUploadCard
                        fileInputRef={fileInputRef}
                        pendingFile={pendingFile}
                        pendingPreviewUrl={pendingPreviewUrl}
                        pendingAlt={pendingAlt}
                        onAltChange={setPendingAlt}
                        pendingIsFeatured={pendingIsFeatured}
                        onFeaturedChange={setPendingIsFeatured}
                        onFileSelected={handleFileSelected}
                        onAddImage={handleAddImage}
                        disabled={disabled}
                    />

                    {/* Existing & Staged Images Gallery Section */}
                    <ProjectImagesGallery
                        images={unifiedImages}
                        disabled={disabled}
                        onSelectImage={handleSelectImage}
                        onDeleteImage={handleDeleteUnifiedImage}
                    />
                </>
            )}
        </div>
    );
}

export default ProjectImagesManager;
