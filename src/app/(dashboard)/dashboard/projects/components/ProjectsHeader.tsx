import React from "react";

export function ProjectsHeaderComponent() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    إدارة المشاريع
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    إدارة مشاريع المعرض، المحتوى باللغتين، التوصيف المنسق بـ Tiptap، والصور والتقنيات المرتبطة
                </p>
            </div>
        </div>
    );
}

export const ProjectsHeader = React.memo(ProjectsHeaderComponent);
export default ProjectsHeader;

