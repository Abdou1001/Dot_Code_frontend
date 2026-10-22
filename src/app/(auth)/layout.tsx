import {Metadata} from "next";

export const metadata: Metadata = {
    title: "تسجيل الدخول | Dot Code",
    description: "تسجيل الدخول إلى لوحة تحكم Dot Code Portfolio",
};

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="min-h-screen flex flex-col items-center justify-between p-4 bg-[#060B26] text-slate-100 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

            <div className="w-full flex-1 flex items-center justify-center relative z-10">
                {children}
            </div>

            <footer className="w-full max-w-sm py-4 text-center relative z-10">
                <p className="text-xs text-slate-400">
                    جميع الحقوق محفوظة &copy; {new Date().getFullYear()} Dot Code
                </p>
            </footer>
        </main>
    );
}
