"use client";

import { useState } from "react";
import { PieChart as PieIcon, PlusCircle, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatRupee } from "@/lib/calculators";
import type { Asset, AssetType } from "@/lib/types";

const DEMO_ASSETS: Asset[] = [
    { id: "1", name: "Nifty 50 Index Fund", type: "equity", currentValue: 800000, investedAmount: 600000 },
    { id: "2", name: "Gold ETF", type: "gold", currentValue: 320000, investedAmount: 280000 },
    { id: "3", name: "SBI FD", type: "fd", currentValue: 250000, investedAmount: 250000 },
    { id: "4", name: "PPF", type: "ppf", currentValue: 380000, investedAmount: 350000 },
    { id: "5", name: "HDFC Mid-cap Fund", type: "equity", currentValue: 250000, investedAmount: 180000 },
];

const ASSET_COLORS: Record<AssetType, string> = {
    equity: "#6366f1",
    debt: "#10b981",
    gold: "#f59e0b",
    "real-estate": "#8b5cf6",
    fd: "#06b6d4",
    ppf: "#14b8a6",
    crypto: "#f43f5e",
    cash: "#64748b",
};

const ASSET_TYPES: AssetType[] = ["equity", "debt", "gold", "real-estate", "fd", "ppf", "crypto", "cash"];

export default function PortfolioPage() {
    const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", type: "equity" as AssetType, currentValue: "", investedAmount: "" });

    const total = assets.reduce((s, a) => s + a.currentValue, 0);
    const totalInvested = assets.reduce((s, a) => s + a.investedAmount, 0);
    const totalGains = total - totalInvested;
    const gainsPct = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;

    // Aggregate for pie chart
    const pieData = ASSET_TYPES.map((t) => ({
        name: t,
        value: assets.filter((a) => a.type === t).reduce((s, a) => s + a.currentValue, 0),
        color: ASSET_COLORS[t],
    })).filter((d) => d.value > 0);

    function addAsset() {
        if (!form.name || !form.currentValue) return;
        const a: Asset = { id: String(Date.now()), name: form.name, type: form.type, currentValue: Number(form.currentValue), investedAmount: Number(form.investedAmount) || Number(form.currentValue) };
        setAssets([...assets, a]);
        setShowForm(false);
        setForm({ name: "", type: "equity", currentValue: "", investedAmount: "" });
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><PieIcon className="text-indigo-400" size={24} />Shadow Portfolio</h1>
                    <p className="text-slate-400 text-sm">Track all your investments in one place</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
                    <PlusCircle size={16} />Add Asset
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Value", value: formatRupee(total), color: "text-white" },
                    { label: "Total Invested", value: formatRupee(totalInvested), color: "text-indigo-400" },
                    { label: "Total Gains", value: `${gainsPct >= 0 ? "+" : ""}${gainsPct.toFixed(1)}% (${formatRupee(Math.abs(totalGains))})`, color: gainsPct >= 0 ? "text-emerald-400" : "text-rose-400" },
                ].map((s) => (
                    <div key={s.label} className="glass p-4 text-center">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="glass p-5 border border-indigo-500/30 space-y-4">
                    <h2 className="text-sm font-semibold text-white">Add Asset</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Asset Name</label>
                            <input className="input-dark" placeholder="e.g. Axis Bluechip Fund" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Type</label>
                            <select className="input-dark" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssetType })}>
                                {ASSET_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Current Value (₹)</label>
                            <input className="input-dark" type="number" placeholder="250000" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Invested Amount (₹)</label>
                            <input className="input-dark" type="number" placeholder="200000" value={form.investedAmount} onChange={(e) => setForm({ ...form, investedAmount: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={addAsset} className="btn-primary text-sm">Add</button>
                        <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pie */}
                <div className="glass p-5">
                    <h2 className="text-sm font-semibold text-white mb-4">Allocation</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(v: number) => formatRupee(v)} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Table */}
                <div className="glass p-5 overflow-auto">
                    <h2 className="text-sm font-semibold text-white mb-4">Holdings</h2>
                    <div className="space-y-2">
                        {assets.map((asset) => {
                            const gains = asset.currentValue - asset.investedAmount;
                            const pct = asset.investedAmount > 0 ? (gains / asset.investedAmount) * 100 : 0;
                            return (
                                <div key={asset.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ASSET_COLORS[asset.type] }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium truncate">{asset.name}</div>
                                        <div className="text-xs text-slate-500">{asset.type}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-white">{formatRupee(asset.currentValue)}</div>
                                        <div className={`text-xs flex items-center gap-0.5 justify-end ${pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                            {pct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
                                        </div>
                                    </div>
                                    <button onClick={() => setAssets(assets.filter((a) => a.id !== asset.id))} className="text-slate-600 hover:text-rose-400 transition-colors ml-2">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
