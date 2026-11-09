"use client";

import React from "react";
import dynamic from "next/dynamic";
import {Project} from "@/types/data";
import {ProjectsDeleteDialog} from "./ProjectsDeleteDialog";

const ProjectMediaDialog = dynamic(
    () => import("../ProjectMediaDialog").then((mod) => mod.ProjectMediaDialog),
    {ssr: false}
);

const ProjectRelationsDialog = dynamic(
    () => import("../ProjectRelationsDialog").then((mod) => mod.ProjectRelationsDialog),
    {ssr: false}
);

interface ProjectsDialogsProps {
    isMediaDialogOpen: boolean;
    onMediaOpenChange: (open: boolean) => void;
    mediaProject: Project | null;
    isRelationsDialogOpen: boolean;
    onRelationsOpenChange: (open: boolean) => void;
    relationsProject: Project | null;
    isDeleteDialogOpen: boolean;
    onDeleteOpenChange: (open: boolean) => void;
    isDeletePending: boolean;
    onConfirmDelete: () => void;
}

export function ProjectsDialogsComponent({
    isMediaDialogOpen,
    onMediaOpenChange,
    mediaProject,
    isRelationsDialogOpen,
    onRelationsOpenChange,
    relationsProject,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    isDeletePending,
    onConfirmDelete,
}: ProjectsDialogsProps) {
    return (
        <>
            {isMediaDialogOpen && (
                <ProjectMediaDialog
                    open={isMediaDialogOpen}
                    onOpenChange={onMediaOpenChange}
                    project={mediaProject}
                />
            )}

            {isRelationsDialogOpen && (
                <ProjectRelationsDialog
                    open={isRelationsDialogOpen}
                    onOpenChange={onRelationsOpenChange}
                    project={relationsProject}
                />
            )}

            <ProjectsDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                isLoading={isDeletePending}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}

export const ProjectsDialogs = React.memo(ProjectsDialogsComponent);
export default ProjectsDialogs;

