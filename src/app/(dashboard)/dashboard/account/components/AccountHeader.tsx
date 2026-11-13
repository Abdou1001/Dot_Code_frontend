import React from "react";

function AccountHeaderComponent() {
    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                بيانات حساب المسؤول
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
                استعراض هوية وصلاحيات حساب المدير المعتمد الحالي في لوحة تحكم Dot Code
            </p>
        </div>
    );
}

export const AccountHeader = React.memo(AccountHeaderComponent);
export default AccountHeader;

