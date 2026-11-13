import {MessagesHeader} from "./components/MessagesHeader";
import {MessagesContent} from "./components/MessagesContent";

export default function MessagesPage() {
    return (
        <div className="space-y-6">
            <MessagesHeader />
            <MessagesContent />
        </div>
    );
}
