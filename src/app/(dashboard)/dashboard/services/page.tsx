import {ServicesHeader} from "./components/ServicesHeader";
import {ServicesContent} from "./components/ServicesContent";

export default function ServicesPage() {
    return (
        <div className="space-y-6">
            <ServicesHeader />
            <ServicesContent />
        </div>
    );
}
