import {Metadata} from "next";
import {ProjectForm} from "@/app/(dashboard)/dashboard/components/projects";

export const metadata: Metadata = {
    title: "إنشاء مشروع جديد | Dot Code Portfolio",
    description: "إضافة مشروع جديد إلى معرض أعمال Dot Code",
};

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <ProjectForm />
        </div>
    );
}
