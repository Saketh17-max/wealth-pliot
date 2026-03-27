"use client";

import { useState, useMemo } from "react";
import { Bot, TrendingUp, AlertTriangle, CheckCircle, Info, XCircle, Zap } from "lucide-react";
import { generateInsights, calculateRiskScore } from "@/lib/ai-engine";
import type { Goal, Asset, RiskLevel } from "@/lib/types";

const DEMO_GOALS: Goal[] = [
    { id: "1", name: "Retirement", category: "retirement", targetAmount: 5000000, targetYear: 2040, currentSavings: 1240000, monthlyContribution: 10000, riskLevel: "moderate", createdAt: Date.now() },
    { id: "2", name: "Car Purchase", category: "other", targetAmount: 800000, targetYear: 2026, currentSavings: 200000, monthlyContribution: 8000, riskLevel: "aggressive", createdAt: Date.now() },
];
const DEMO_PORTFOLIO: Asset[] = [
    { id: "1", name: "Nifty 50 Index Fund", type: "equity", currentValue: 800000, investedAmount: 600000 },
    { id: "2", name: "Gold ETF", type: "gold", currentValue: 320000, investedAmount: 280000 },
    { id: "3", name: "SBI FD", type: "fd", currentValue: 250000, investedAmount: 250000 },
    { id: "4", name: "PPF", type: "ppf", currentValue: 380000, investedAmount: 350000 },
];

const ICON_MAP = {
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
    critical: XCircle,
};
const COLOR_MAP = {
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    info: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    critical: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export default function CopilotPage() {
    const [income, setIncome] = useState(100000);
    const [expenses, setExpenses] = useState(60000);
    const [efMonths, setEfMonths] = useState(4);
    const [risk, setRisk] = useState<RiskLevel>("moderate");

    const insights = useMemo(
        () => generateInsights(DEMO_GOALS, DEMO_PORTFOLIO, income, expenses, efMonths, risk),
        [income, expenses, efMonths, risk]
    );

    const totalPortfolio = DEMO_PORTFOLIO.reduce((s, a) => s + a.currentValue, 0);
    const goldPct = (DEMO_PORTFOLIO.find((a) => a.type === "gold")?.currentValue || 0) / totalPortfolio * 100;
    const savingsRate = ((income - expenses) / income) * 100;
    const riskScore = calculateRiskScore(risk, efMonths, goldPct, savingsRate);

    const riskLabel = riskScore < 35 ? "Low Risk" : riskScore < 65 ? "Moderate Risk" : "High Risk";
    const riskColor = riskScore < 35 ? "#10b981" : riskScore < 65 ? "#f59e0b" : "#f43f5e";

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Bot className="text-indigo-400" size={24} />AI Financial Co-Pilot</h1>
                <p className="text-slate-400 text-sm">Personalized insights based on your financial profile</p>
            </div>

            {/* Input Config */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-slate-300 mb-4">Your Financial Profile</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Monthly Income (₹)</label>
                        <input className="input-dark" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Monthly Expenses (₹)</label>
                        <input className="input-dark" type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Emergency Fund (months)</label>
                        <input className="input-dark" type="number" min="0" max="24" value={efMonths} onChange={(e) => setEfMonths(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Risk Profile</label>
                        <select className="input-dark" value={risk} onChange={(e) => setRisk(e.target.value as RiskLevel)}>
                            <option value="conservative">Conservative</option>
                            <option value="moderate">Moderate</option>
                            <option value="aggressive">Aggressive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Risk Score Gauge */}
                <div className="glass p-5 flex flex-col items-center gap-4">
                    <h2 className="text-sm font-semibold text-white w-full">Financial Health Score</h2>
                    <div className="relative w-36 h-36">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                            <circle
                                cx="60" cy="60" r="50" fill="none"
                                stroke={riskColor} strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${(riskScore / 100) * 314} 314`}
                                className="transition-all duration-700"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                            <div className="text-3xl font-bold text-white">{100 - riskScore}</div>
                            <div className="text-xs text-slate-400">/ 100</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-center font-semibold text-sm" style={{ color: riskColor }}>{riskLabel}</div>
                        <div className="text-xs text-slate-500 text-center mt-1">Savings rate: {savingsRate.toFixed(0)}%</div>
                    </div>
                    <div className="w-full space-y-2 text-xs">
                        {[
                            { label: "Emergency Fund", val: Math.min(100, (efMonths / 6) * 100), color: "#10b981" },
                            { label: "Savings Rate", val: Math.min(100, savingsRate * 2), color: "#6366f1" },
                            { label: "Diversification", val: 70, color: "#f59e0b" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-slate-400 mb-0.5">
                                    <span>{item.label}</span><span>{item.val.toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights */}
                <div className="lg:col-span-2 space-y-3">
                    {insights.map((insight) => {
                        const Icon = ICON_MAP[insight.type];
                        return (
                            <div key={insight.id} className={`border rounded-xl p-4 ${COLOR_MAP[insight.type]}`}>
                                <div className="flex gap-3">
                                    <Icon size={18} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-sm">{insight.title}</div>
                                        <div className="text-xs mt-1 opacity-80">{insight.description}</div>
                                        {insight.action && (
                                            <div className="mt-2 text-xs font-medium flex items-center gap-1">
                                                <Zap size={12} /> {insight.action}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
