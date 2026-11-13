import {TechnologiesHeader} from "./components/TechnologiesHeader";
import {TechnologiesContent} from "./components/TechnologiesContent";

export default function TechnologiesPage() {
    return (
        <div className="space-y-6">
            <TechnologiesHeader />
            <TechnologiesContent />
        </div>
    );
}
