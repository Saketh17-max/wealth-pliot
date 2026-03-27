"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Target, Bot, Calculator, PieChart, RefreshCw, ShieldAlert, Flame, ArrowRight, DollarSign, TrendingDown, Activity } from "lucide-react";
import { formatRupee, sipFutureValue } from "@/lib/calculators";

const quickStats = [
    { label: "Net Worth (Demo)", value: "₹12.4L", change: "+8.3%", positive: true, color: "indigo", icon: DollarSign },
    { label: "Goals on Track", value: "3 / 4", change: "+1 this month", positive: true, color: "emerald", icon: Target },
    { label: "Monthly SIP", value: "₹15,000", change: "Active", positive: true, color: "amber", icon: TrendingUp },
    { label: "Portfolio Risk", value: "Moderate", change: "Balanced", positive: true, color: "rose", icon: Activity },
];

const demoGoals = [
    { name: "Retirement Corpus", target: 5000000, current: 1240000, year: 2040, risk: "moderate" },
    { name: "Child Education", target: 2000000, current: 380000, year: 2032, risk: "moderate" },
    { name: "Emergency Fund", target: 300000, current: 280000, year: 2025, risk: "conservative" },
];

const quickLinks = [
    { href: "/goals", icon: Target, label: "Goals", color: "from-indigo-500 to-indigo-700" },
    { href: "/copilot", icon: Bot, label: "AI Co-Pilot", color: "from-emerald-500 to-emerald-700" },
    { href: "/calculator", icon: Calculator, label: "Calculator", color: "from-amber-500 to-amber-700" },
    { href: "/portfolio", icon: PieChart, label: "Portfolio", color: "from-violet-500 to-violet-700" },
    { href: "/market-lab", icon: TrendingUp, label: "Market Lab", color: "from-sky-500 to-sky-700" },
    { href: "/rebalancing", icon: RefreshCw, label: "Rebalancing", color: "from-rose-500 to-rose-700" },
    { href: "/risk", icon: ShieldAlert, label: "Risk Analysis", color: "from-orange-500 to-orange-700" },
    { href: "/fire", icon: Flame, label: "FIRE Planner", color: "from-red-500 to-red-700" },
];

const aiPreviews = [
    { type: "warning", text: "Emergency fund is below 6 months. Build ₹1.8L buffer." },
    { type: "info", text: "Tax saving opportunity: Invest ₹1.5L in ELSS before March 31." },
    { type: "success", text: "Portfolio is well-diversified across 5 asset classes." },
];

export default function DashboardPage() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm">Welcome back! Here&apos;s your financial overview.</p>
                </div>
                <Link href="/goals" className="btn-primary text-sm">
                    <Target size={16} />
                    Add Goal
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat) => (
                    <div key={stat.label} className={`glass p-4 stat-card-${stat.color}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-9 h-9 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                                <stat.icon size={18} className={`text-${stat.color}-400`} />
                            </div>
                            <span className={`text-xs ${stat.positive ? "text-emerald-400" : "text-rose-400"} font-medium`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div>
                <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Quick Access</h2>
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                    {quickLinks.map(({ href, icon: Icon, label, color }) => (
                        <Link key={href} href={href} className="glass glass-hover flex flex-col items-center gap-2 p-3 text-center group">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <span className="text-xs text-slate-300 font-medium">{label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Goals */}
                <div className="glass p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">Active Goals</h2>
                        <Link href="/goals" className="text-indigo-400 text-xs flex items-center gap-1 hover:text-indigo-300">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    {demoGoals.map((goal) => {
                        const pct = Math.min(100, (goal.current / goal.target) * 100);
                        return (
                            <div key={goal.name} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white font-medium">{goal.name}</span>
                                    <span className="text-slate-400">{formatRupee(goal.current)} / {formatRupee(goal.target)}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{pct.toFixed(1)}% complete</span>
                                    <span>Target: {goal.year}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* AI Insights Preview */}
                <div className="glass p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">AI Insights</h2>
                        <Link href="/copilot" className="text-indigo-400 text-xs flex items-center gap-1 hover:text-indigo-300">
                            Full analysis <ArrowRight size={12} />
                        </Link>
                    </div>
                    {aiPreviews.map((insight, i) => (
                        <div
                            key={i}
                            className={`flex gap-3 p-3 rounded-xl border text-sm ${insight.type === "warning"
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                                    : insight.type === "critical"
                                        ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                                        : insight.type === "success"
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                }`}
                        >
                            <span className="flex-shrink-0">{insight.type === "warning" ? "⚠️" : insight.type === "success" ? "✅" : "💡"}</span>
                            <span>{insight.text}</span>
                        </div>
                    ))}
                    <Link href="/copilot" className="btn-primary w-full justify-center text-sm">
                        <Bot size={16} />
                        Open AI Co-Pilot
                    </Link>
                </div>
            </div>
        </div>
    );
}
