"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only enforce auth if Firebase is properly configured (not demo-key)
        if (!loading && !user && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-key") {
            router.replace("/login");
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center hero-bg">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen hero-bg">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-auto">
                {children}
                {/* Disclaimer Footer */}
                <footer className="border-t border-white/5 mt-8 py-4 px-6 text-center">
                    <p className="text-xs text-slate-600">
                        ⚠️ WealthPilot AI is for educational and informational purposes only. Not financial advice.
                        Consult a SEBI-registered financial advisor before investing.
                    </p>
                </footer>
            </main>
        </div>
    );
}
