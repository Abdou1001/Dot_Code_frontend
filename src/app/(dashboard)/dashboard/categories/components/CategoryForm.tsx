"use client";

import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {Category} from "@/types/data";
import {createCategory, updateCategory} from "@/services/categories.api";
import {getApiErrorMessage} from "@/hooks/useApiError";
import {
    CategoryFormFields,
    CategoryFormValues,
} from "./CategoryFormFields";
import {CategoryFormActions} from "./CategoryFormActions";

interface CategoryFormProps {
    categoryToEdit?: Category | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({categoryToEdit, onSuccess, onCancel}: CategoryFormProps) {
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
            name_ar: "",
            slug: "",
            sort_order: 0,
            is_active: true,
        },
    });

    const isActive = watch("is_active");

    useEffect(() => {
        if (categoryToEdit) {
            setValue("name", categoryToEdit.name || "");
            setValue("name_ar", categoryToEdit.name_ar || "");
            setValue("slug", categoryToEdit.slug || "");
            setValue("sort_order", categoryToEdit.sort_order ?? 0);
            setValue("is_active", categoryToEdit.is_active ?? true);
        } else {
            reset({
                name: "",
                name_ar: "",
                slug: "",
                sort_order: 0,
                is_active: true,
            });
        }
    }, [categoryToEdit, setValue, reset]);

    const mutation = useMutation({
        mutationFn: async (values: CategoryFormValues) => {
            const payload = {
                name: values.name.trim(),
                name_ar: values.name_ar?.trim() || null,
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
            queryClient.invalidateQueries({queryKey: ["active-categories"]});
            toast.success(isEdit ? "تم تحديث التصنيف بنجاح" : "تم إنشاء التصنيف بنجاح");
            onSuccess();
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <CategoryFormFields
                register={register}
                isActive={isActive}
                onActiveChange={(val) => setValue("is_active", val)}
            />

            <CategoryFormActions
                isEdit={isEdit}
                isPending={mutation.isPending}
                isSubmitting={isSubmitting}
                onCancel={onCancel}
            />
        </form>
    );
}
