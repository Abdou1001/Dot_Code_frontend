import React from "react";

function CategoriesHeaderComponent() {
    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                إدارة التصنيفات
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
                تنظيم وتصنيف مشاريع Dot Code وفق مجالات التخصص البرمجي
            </p>
        </div>
    );
}

export const CategoriesHeader = React.memo(CategoriesHeaderComponent);
export default CategoriesHeader;

