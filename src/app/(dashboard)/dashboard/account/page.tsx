import {AccountHeader} from "./components/AccountHeader";
import {AccountContent} from "./components/AccountContent";

export default function AccountPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <AccountHeader />
            <AccountContent />
        </div>
    );
}
