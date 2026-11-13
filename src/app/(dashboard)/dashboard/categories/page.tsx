import {CategoriesHeader} from "./components/CategoriesHeader";
import {CategoriesContent} from "./components/CategoriesContent";

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <CategoriesHeader />
            <CategoriesContent />
        </div>
    );
}
