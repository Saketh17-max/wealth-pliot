"use client";

import { useState, useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import { calculateRiskScore } from "@/lib/ai-engine";
import type { RiskLevel } from "@/lib/types";

interface Factor {
    label: string;
    score: number;
    description: string;
}

export default function RiskPage() {
    const [income, setIncome] = useState(100000);
    const [expenses, setExpenses] = useState(60000);
    const [efMonths, setEfMonths] = useState(4);
    const [risk, setRisk] = useState<RiskLevel>("moderate");
    const [goldPct, setGoldPct] = useState(16);

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const riskScore = calculateRiskScore(risk, efMonths, goldPct, savingsRate);

    const healthScore = 100 - riskScore;
    const riskLabel = riskScore < 35 ? "Low Risk" : riskScore < 65 ? "Moderate Risk" : "High Risk";
    const riskColor = riskScore < 35 ? "#10b981" : riskScore < 65 ? "#f59e0b" : "#f43f5e";

    const factors: Factor[] = useMemo(() => [
        { label: "Emergency Fund", score: Math.min(100, (efMonths / 6) * 100), description: `${efMonths} months covered (target: 6)` },
        { label: "Savings Rate", score: Math.min(100, savingsRate * 2), description: `${savingsRate.toFixed(0)}% of income saved` },
        { label: "Risk Profile Fit", score: risk === "moderate" ? 80 : risk === "conservative" ? 90 : 50, description: `Profile: ${risk}` },
        { label: "Gold Allocation", score: goldPct > 15 ? 30 : goldPct > 10 ? 60 : 85, description: `${goldPct}% in gold (ideal: 5-10%)` },
        { label: "Diversification", score: 70, description: "5 asset classes (equity, gold, FD, PPF, debt)" },
        { label: "Insurance Coverage", score: 55, description: "Health cover estimated based on income" },
    ], [efMonths, savingsRate, risk, goldPct]);

    // SVG gauge
    const angle = (riskScore / 100) * 180 - 90;
    const needleX = 100 + 70 * Math.cos((angle * Math.PI) / 180);
    const needleY = 100 + 70 * Math.sin((angle * Math.PI) / 180);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShieldAlert className="text-indigo-400" size={24} />Risk Analysis</h1>
                <p className="text-slate-400 text-sm">Understand and manage your financial risk exposure</p>
            </div>

            {/* Config */}
            <div className="glass p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <label className="text-xs text-slate-400 block mb-1">Gold % in Portfolio</label>
                    <input className="input-dark" type="number" min="0" max="100" value={goldPct} onChange={(e) => setGoldPct(Number(e.target.value))} />
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Gauge */}
                <div className="glass p-6 flex flex-col items-center gap-4">
                    <h2 className="text-sm font-semibold text-white w-full">Risk Gauge</h2>
                    <svg viewBox="0 0 200 120" className="w-full max-w-xs">
                        {/* Background arc */}
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" strokeLinecap="round" />
                        {/* Colored segments */}
                        <path d="M 20 100 A 80 80 0 0 1 100 20" fill="none" stroke="#10b981" strokeWidth="20" strokeLinecap="butt" opacity="0.6" />
                        <path d="M 100 20 A 80 80 0 0 1 180 100" fill="none" stroke="#f43f5e" strokeWidth="20" strokeLinecap="butt" opacity="0.6" />
                        {/* Needle */}
                        <line x1="100" y1="100" x2={needleX} y2={needleY} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="6" fill="#fff" />
                        {/* Labels */}
                        <text x="16" y="118" fontSize="9" fill="#10b981">Low</text>
                        <text x="87" y="14" fontSize="9" fill="#f59e0b">Med</text>
                        <text x="168" y="118" fontSize="9" fill="#f43f5e">High</text>
                    </svg>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white">{riskScore}</div>
                        <div className="text-sm font-semibold mt-1" style={{ color: riskColor }}>{riskLabel}</div>
                        <div className="text-xs text-slate-400 mt-1">Health Score: {healthScore}/100</div>
                        <div>
                            <select className="input-dark mt-3 text-xs" value={risk} onChange={(e) => setRisk(e.target.value as RiskLevel)}>
                                <option value="conservative">Conservative Profile</option>
                                <option value="moderate">Moderate Profile</option>
                                <option value="aggressive">Aggressive Profile</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Factor Analysis */}
                <div className="glass p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white">Risk Factors</h2>
                    {factors.map((f) => (
                        <div key={f.label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-300 font-medium">{f.label}</span>
                                <span className="text-slate-500">{f.score.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${f.score}%`,
                                        background: f.score > 70 ? "#10b981" : f.score > 40 ? "#f59e0b" : "#f43f5e",
                                    }}
                                />
                            </div>
                            <div className="text-xs text-slate-600">{f.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Volatility & Drawdown */}
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { label: "Volatility Score", value: risk === "aggressive" ? "High" : risk === "moderate" ? "Medium" : "Low", score: risk === "aggressive" ? 75 : risk === "moderate" ? 45 : 20, color: risk === "aggressive" ? "#f43f5e" : risk === "moderate" ? "#f59e0b" : "#10b981" },
                    { label: "Max Drawdown Risk", value: risk === "aggressive" ? "~40%" : risk === "moderate" ? "~22%" : "~12%", score: risk === "aggressive" ? 80 : risk === "moderate" ? 50 : 25, color: "#6366f1" },
                    { label: "Liquidity Risk", value: efMonths < 3 ? "Critical" : efMonths < 6 ? "Medium" : "Low", score: efMonths < 3 ? 85 : efMonths < 6 ? 55 : 20, color: efMonths < 3 ? "#f43f5e" : efMonths < 6 ? "#f59e0b" : "#10b981" },
                ].map((m) => (
                    <div key={m.label} className="glass p-5 text-center">
                        <div className="text-lg font-bold text-white">{m.value}</div>
                        <div className="text-xs text-slate-400 mb-3">{m.label}</div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: m.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
