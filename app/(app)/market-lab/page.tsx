"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { niftyHistoricalData, niftyCagr, marketComparisonData } from "@/lib/nifty-data";
import { formatRupee } from "@/lib/calculators";

const HORIZONS = [3, 5, 7, 10, 15, 20];

export default function MarketLabPage() {
    const [monthly, setMonthly] = useState(10000);
    const [horizon, setHorizon] = useState(10);

    const cagrData = HORIZONS.map((h) => ({ horizon: `${h}Y`, cagr: niftyCagr(h).toFixed(1) }));
    const comparisonData = useMemo(() => marketComparisonData(horizon, monthly), [monthly, horizon]);

    const growthData = [
        { name: "Conservative (8%)", color: "#10b981", key: "conservative" },
        { name: "Moderate (12%)", color: "#6366f1", key: "moderate" },
        { name: "Aggressive (15%)", color: "#f59e0b", key: "aggressive" },
    ];

    const growthSeries = useMemo(() => {
        const rates: Record<string, number> = { conservative: 8, moderate: 12, aggressive: 15 };
        return niftyHistoricalData.map((d, i) => {
            const yearsSince = i + 1;
            const base = monthly * 12;
            return {
                year: d.year,
                conservative: Math.round(base * (((1 + 0.08 / 12) ** (yearsSince * 12) - 1) / (0.08 / 12))),
                moderate: Math.round(base * (((1 + 0.12 / 12) ** (yearsSince * 12) - 1) / (0.12 / 12))),
                aggressive: Math.round(base * (((1 + 0.15 / 12) ** (yearsSince * 12) - 1) / (0.15 / 12))),
            };
        });
    }, [monthly]);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-indigo-400" size={24} />Market Performance Lab</h1>
                <p className="text-slate-400 text-sm">Historical NIFTY 50 analysis and SIP simulation</p>
            </div>

            {/* CAGR Table */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">NIFTY 50 Historical CAGR</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {cagrData.map((d) => (
                        <div key={d.horizon} className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-2xl font-bold text-indigo-400">{d.cagr}%</div>
                            <div className="text-xs text-slate-400">{d.horizon} CAGR</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Config */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Simulation Parameters</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Monthly SIP (₹)</label>
                        <input className="input-dark" type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} step={1000} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Horizon (years)</label>
                        <input className="input-dark" type="range" min="3" max="20" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} />
                        <div className="text-xs text-indigo-400 mt-1">{horizon} years</div>
                    </div>
                </div>
            </div>

            {/* SIP vs Lumpsum */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">SIP vs Lumpsum Growth ({horizon} years)</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatRupee(v)} width={72} />
                        <Tooltip formatter={(v: number) => formatRupee(v)} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                        <Legend />
                        <Area type="monotone" dataKey="sip" name="SIP Growth" stroke="#6366f1" fill="rgba(99,102,241,0.1)" strokeWidth={2} />
                        <Area type="monotone" dataKey="lumpsum" name="Lumpsum Growth" stroke="#10b981" fill="rgba(16,185,129,0.1)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 3-Curve Comparison */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Conservative vs Moderate vs Aggressive SIP</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={growthSeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatRupee(v)} width={72} />
                        <Tooltip formatter={(v: number) => formatRupee(v)} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                        <Legend />
                        {growthData.map((g) => (
                            <Line key={g.key} type="monotone" dataKey={g.key} name={g.name} stroke={g.color} strokeWidth={2} dot={false} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
