"use client";

import { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { calculateRebalancing } from "@/lib/ai-engine";
import { formatRupee } from "@/lib/calculators";
import type { Asset, RiskLevel } from "@/lib/types";

const DEMO_PORTFOLIO: Asset[] = [
    { id: "1", name: "Nifty 50 Index Fund", type: "equity", currentValue: 800000, investedAmount: 600000 },
    { id: "2", name: "Gold ETF", type: "gold", currentValue: 320000, investedAmount: 280000 },
    { id: "3", name: "SBI FD", type: "fd", currentValue: 250000, investedAmount: 250000 },
    { id: "4", name: "PPF", type: "ppf", currentValue: 380000, investedAmount: 350000 },
    { id: "5", name: "HDFC Mid-cap Fund", type: "equity", currentValue: 250000, investedAmount: 180000 },
];

const IDEAL: Record<RiskLevel, Record<string, number>> = {
    conservative: { Equity: 30, Debt: 50, Gold: 10, Cash: 10 },
    moderate: { Equity: 60, Debt: 25, Gold: 10, Cash: 5 },
    aggressive: { Equity: 80, Debt: 10, Gold: 5, Cash: 5 },
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#06b6d4"];

export default function RebalancingPage() {
    const [risk, setRisk] = useState<RiskLevel>("moderate");
    const actions = useMemo(() => calculateRebalancing(DEMO_PORTFOLIO, risk), [risk]);
    const total = DEMO_PORTFOLIO.reduce((s, a) => s + a.currentValue, 0);

    const currentPie = actions.map((a, i) => ({ name: a.asset, value: a.current, color: COLORS[i % COLORS.length] }));
    const idealPie = actions.map((a, i) => ({ name: a.asset, value: a.ideal, color: COLORS[i % COLORS.length] }));

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><RefreshCw className="text-indigo-400" size={24} />Portfolio Rebalancing</h1>
                    <p className="text-slate-400 text-sm">Align your portfolio with your target allocation</p>
                </div>
                <div>
                    <select className="input-dark" value={risk} onChange={(e) => setRisk(e.target.value as RiskLevel)}>
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                    </select>
                </div>
            </div>

            {/* Current vs Ideal Pies */}
            <div className="grid md:grid-cols-2 gap-4">
                {[{ title: "Current Allocation", data: currentPie }, { title: `Ideal Allocation (${risk})`, data: idealPie }].map((chart) => (
                    <div key={chart.title} className="glass p-5">
                        <h2 className="text-sm font-semibold text-white mb-3">{chart.title}</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={chart.data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                                    {chart.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Current vs Ideal (%)</h2>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={actions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="asset" stroke="#475569" tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 12 }} unit="%" />
                        <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                        <Legend />
                        <Bar dataKey="current" name="Current %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ideal" name="Ideal %" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Action Table */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Rebalancing Actions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-slate-500 border-b border-white/10">
                                <th className="pb-2">Asset</th>
                                <th className="pb-2">Current</th>
                                <th className="pb-2">Ideal</th>
                                <th className="pb-2">Action</th>
                                <th className="pb-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {actions.map((a) => (
                                <tr key={a.asset} className="py-2">
                                    <td className="py-3 text-white font-medium">{a.asset}</td>
                                    <td className="py-3 text-slate-300">{a.current}%</td>
                                    <td className="py-3 text-slate-300">{a.ideal}%</td>
                                    <td className="py-3">
                                        <span className={`badge ${a.action === "buy" ? "badge-emerald" : a.action === "sell" ? "badge-rose" : "badge-indigo"}`}>
                                            {a.action.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 font-semibold" style={{ color: a.action === "buy" ? "#34d399" : a.action === "sell" ? "#fb7185" : "#64748b" }}>
                                        {a.action !== "hold" ? formatRupee(a.amount) : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
