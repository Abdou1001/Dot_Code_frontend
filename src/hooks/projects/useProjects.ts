import {useQuery, useMutation, useQueryClient, keepPreviousData} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    getDashboardProjects,
    deleteProject,
    updateProjectStatus,
    getProjectImages,
    uploadProjectImage,
    updateProjectImage,
    deleteProjectImage,
    getProjectTechnologies,
    assignProjectTechnology,
    removeProjectTechnology,
    getProjectCategories,
    assignProjectCategory,
    removeProjectCategory,
    ProjectListParams,
} from "@/services/projects.api";
import {getApiErrorMessage} from "@/hooks/useApiError";
import {ProjectStatus} from "@/types/enums";

export const useProjects = (params?: ProjectListParams) => {
    return useQuery({
        queryKey: [
            "dashboard-projects",
            params?.page,
            params?.limit,
            params?.search,
            params?.status,
        ],
        queryFn: ({signal}) => getDashboardProjects(params, signal),
        placeholderData: keepPreviousData,
    });
};

export const useProjectsCount = () => {
    return useQuery({
        queryKey: ["dashboard-projects-count"],
        queryFn: ({signal}) => getDashboardProjects({limit: 1}, signal),
        staleTime: 2 * 60 * 1000,
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects-count"]});
            toast.success("تم حذف المشروع بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف المشروع"));
        },
    });
};

export const useUpdateProjectStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, status}: {id: string; status: ProjectStatus}) =>
            updateProjectStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم تحديث حالة المشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تغيير حالة المشروع"));
        },
    });
};

// Project Images Hooks
export const useProjectImages = (projectId?: string, enabled = true) => {
    return useQuery({
        queryKey: ["project-images", projectId],
        queryFn: ({signal}) => getProjectImages(projectId!, signal),
        enabled: Boolean(projectId && enabled),
    });
};

export const useUploadProjectImage = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => uploadProjectImage(projectId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-images", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم رفع الصورة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل رفع الصورة"));
        },
    });
};

export const useUpdateProjectImage = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            imageId,
            payload,
        }: {
            imageId: string;
            payload: {alt?: string; sort_order?: number; is_featured?: boolean};
        }) => updateProjectImage(projectId, imageId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-images", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم تحديث الصورة");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث الصورة"));
        },
    });
};

export const useDeleteProjectImage = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId: string) => deleteProjectImage(projectId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-images", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم حذف الصورة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف الصورة"));
        },
    });
};

// Project Technologies Hooks
export const useProjectTechnologies = (projectId?: string, enabled = true) => {
    return useQuery({
        queryKey: ["project-technologies", projectId],
        queryFn: ({signal}) => getProjectTechnologies(projectId!, signal),
        enabled: Boolean(projectId && enabled),
    });
};

export const useAssignProjectTechnology = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (techId: string) => assignProjectTechnology(projectId, techId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-technologies", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم ربط التقنية بالمشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل ربط التقنية"));
        },
    });
};

export const useRemoveProjectTechnology = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (techId: string) => removeProjectTechnology(projectId, techId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-technologies", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم إلغاء ربط التقنية");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل فك ربط التقنية"));
        },
    });
};

// Project Categories Hooks
export const useProjectCategories = (projectId?: string, enabled = true) => {
    return useQuery({
        queryKey: ["project-categories", projectId],
        queryFn: ({signal}) => getProjectCategories(projectId!, signal),
        enabled: Boolean(projectId && enabled),
    });
};

export const useAssignProjectCategory = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (catId: string) => assignProjectCategory(projectId, catId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-categories", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم ربط التصنيف بالمشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل ربط التصنيف"));
        },
    });
};

export const useRemoveProjectCategory = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (catId: string) => removeProjectCategory(projectId, catId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-categories", projectId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم إلغاء ربط التصنيف");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل فك ربط التصنيف"));
        },
    });
};
