"use client";

import {UseFormRegister} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

export interface CategoryFormValues {
    name: string;
    name_ar?: string;
    slug: string;
    sort_order: number;
    is_active: boolean;
}

interface CategoryFormFieldsProps {
    register: UseFormRegister<CategoryFormValues>;
    isActive: boolean;
    onActiveChange: (val: boolean) => void;
}

export function CategoryFormFields({
    register,
    isActive,
    onActiveChange,
}: CategoryFormFieldsProps) {
    return (
        <div className="space-y-4">
            {/* Arabic Name */}
            <div className="space-y-2">
                <Label htmlFor="category-name-ar" className="text-xs text-slate-300">
                    اسم التصنيف بالعربية (Arabic Name)
                </Label>
                <Input
                    id="category-name-ar"
                    {...register("name_ar")}
                    placeholder="مثال: تطوير الويب"
                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                />
            </div>

            {/* English / Default Name */}
            <div className="space-y-2">
                <Label htmlFor="category-name" className="text-xs text-slate-300">
                    اسم التصنيف بالإنجليزية (English / Default Name) *
                </Label>
                <Input
                    id="category-name"
                    {...register("name", {required: true})}
                    dir="ltr"
                    placeholder="Web Development"
                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                />
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <Label htmlFor="category-slug" className="text-xs text-slate-300">
                    الرابط المختصر (Slug) *
                </Label>
                <Input
                    id="category-slug"
                    {...register("slug", {required: true})}
                    dir="ltr"
                    placeholder="web-development"
                    className="border-white/10 bg-white/5 text-slate-100 font-mono text-xs"
                />
            </div>

            {/* Sort Order & Active Status */}
            <div className="grid grid-cols-2 gap-4 items-center pt-1">
                <div className="space-y-2">
                    <Label htmlFor="category-sort-order" className="text-xs text-slate-300">
                        الترتيب
                    </Label>
                    <Input
                        id="category-sort-order"
                        {...register("sort_order")}
                        type="number"
                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                    />
                </div>

                <div className="flex items-center gap-2 pt-6">
                    <Checkbox
                        id="category-is-active"
                        checked={isActive}
                        onCheckedChange={(val) => onActiveChange(Boolean(val))}
                        className="border-white/20 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="category-is-active" className="text-xs text-slate-300 cursor-pointer">
                        تصنيف نشط
                    </Label>
                </div>
            </div>
        </div>
    );
}
