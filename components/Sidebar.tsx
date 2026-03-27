"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Target,
    Bot,
    TrendingUp,
    Calculator,
    PieChart,
    RefreshCw,
    ShieldAlert,
    FileText,
    Flame,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/copilot", icon: Bot, label: "AI Co-Pilot" },
    { href: "/market-lab", icon: TrendingUp, label: "Market Lab" },
    { href: "/calculator", icon: Calculator, label: "Calculator" },
    { href: "/portfolio", icon: PieChart, label: "Portfolio" },
    { href: "/rebalancing", icon: RefreshCw, label: "Rebalancing" },
    { href: "/risk", icon: ShieldAlert, label: "Risk Analysis" },
    { href: "/reports", icon: FileText, label: "Reports" },
    { href: "/fire", icon: Flame, label: "FIRE Planner" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    async function handleSignOut() {
        try {
            await signOut(auth);
            router.replace("/login");
        } catch {
            // ignore
        }
    }

    return (
        <aside
            className="relative flex-shrink-0 h-screen sticky top-0 overflow-hidden transition-all duration-300"
            style={{ width: collapsed ? "72px" : "240px" }}
        >
            {/* Sidebar background */}
            <div className="h-full border-r border-white/5 bg-[#070d1f]/90 backdrop-blur-xl flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        ₹
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold text-white whitespace-nowrap">WealthPilot</div>
                            <div className="text-xs text-indigo-400 whitespace-nowrap">AI Co-Pilot</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${active
                                        ? "bg-indigo-500/20 text-indigo-300 shadow-inner"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                    }`}
                            >
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full" />
                                )}
                                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} size={18} />
                                {!collapsed && <span className="whitespace-nowrap">{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + collapse */}
                <div className="border-t border-white/5 p-3 space-y-2">
                    {!collapsed && user && (
                        <div className="flex items-center gap-2 px-2 py-1">
                            <div className="w-7 h-7 rounded-full bg-indigo-500/30 flex items-center justify-center">
                                <User size={14} className="text-indigo-400" />
                            </div>
                            <div className="text-xs text-slate-400 truncate">{user.displayName || user.email || "Demo User"}</div>
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                        <LogOut size={16} />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center py-1 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </div>
        </aside>
    );
}
