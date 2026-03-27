"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) router.replace("/dashboard");
            else router.replace("/login");
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center hero-bg">
            <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">₹</div>
                <div className="text-slate-400 text-sm">Loading WealthPilot...</div>
                <div className="mt-4 w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        </div>
    );
}
