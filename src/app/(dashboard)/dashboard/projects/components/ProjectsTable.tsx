"use client";

import React, {useMemo} from "react";
import {Project} from "@/types/data";
import {ProjectStatus} from "@/types/enums";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import {getProjectTableColumns} from "@/app/(dashboard)/dashboard/components/projects/ProjectTableColumns";

interface ProjectsTableProps {
    data: Project[];
    isLoading: boolean;
    isFetching?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    onManageMedia: (project: Project) => void;
    onManageRelations: (project: Project) => void;
    onStatusChange: (id: string, status: ProjectStatus) => void;
}

function ProjectsTableComponent({
    data,
    isLoading,
    isFetching,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
    onManageMedia,
    onManageRelations,
    onStatusChange,
}: ProjectsTableProps) {
    const columns = useMemo(
        () =>
            getProjectTableColumns({
                onEdit,
                onDelete,
                onManageMedia,
                onManageRelations,
                onStatusChange,
            }),
        [onEdit, onDelete, onManageMedia, onManageRelations, onStatusChange]
    );

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            isFetching={isFetching}
            pagination={pagination}
            onPageChange={onPageChange}
            emptyTitle="لا توجد مشاريع"
            emptyDescription="لم يتم العثور على أي مشاريع تطابق البحث أو التصفية الحالية."
        />
    );
}

export const ProjectsTable = React.memo(ProjectsTableComponent);
export default ProjectsTable;

