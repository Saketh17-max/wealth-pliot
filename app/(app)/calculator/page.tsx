"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { sipFutureValue, lumpsumFutureValue, formatRupee } from "@/lib/calculators";

export default function CalculatorPage() {
    const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
    const [monthly, setMonthly] = useState(5000);
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const { fv, invested, gains, series } = useMemo(() => {
        if (mode === "sip") {
            const fv = sipFutureValue(monthly, rate, years);
            const invested = monthly * 12 * years;
            const gains = fv - invested;
            const series = Array.from({ length: years + 1 }, (_, i) => ({
                year: i,
                corpus: Math.round(sipFutureValue(monthly, rate, i)),
                invested: monthly * 12 * i,
            }));
            return { fv, invested, gains, series };
        } else {
            const fv = lumpsumFutureValue(principal, rate, years);
            const gains = fv - principal;
            const series = Array.from({ length: years + 1 }, (_, i) => ({
                year: i,
                corpus: Math.round(lumpsumFutureValue(principal, rate, i)),
                invested: principal,
            }));
            return { fv, invested: principal, gains, series };
        }
    }, [mode, monthly, principal, rate, years]);

    const pieData = [
        { name: "Invested", value: Math.round(invested), color: "#6366f1" },
        { name: "Gains", value: Math.round(gains), color: "#10b981" },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Calculator className="text-indigo-400" size={24} />SIP & Lumpsum Calculator</h1>
                <p className="text-slate-400 text-sm">Visualize your investment growth with interactive controls</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
                {(["sip", "lumpsum"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m ? "bg-indigo-500 text-white shadow-lg" : "btn-secondary"}`}
                    >
                        {m === "sip" ? "SIP Calculator" : "Lumpsum Calculator"}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="glass p-5 space-y-5">
                    <h2 className="text-sm font-semibold text-white">Parameters</h2>
                    {mode === "sip" ? (
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Monthly SIP (₹{monthly.toLocaleString()})</label>
                            <input type="range" min="500" max="100000" step="500" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Lumpsum Amount (₹{principal.toLocaleString()})</label>
                            <input type="range" min="10000" max="10000000" step="10000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Expected Return ({rate}% p.a.)</label>
                        <input type="range" min="4" max="25" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Time Period ({years} years)</label>
                        <input type="range" min="1" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    {/* Results */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Amount Invested</span>
                            <span className="text-white font-semibold">{formatRupee(invested)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Gains</span>
                            <span className="text-emerald-400 font-semibold">{formatRupee(gains)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Future Value</span>
                            <span className="text-indigo-400 font-bold text-base">{formatRupee(fv)}</span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass p-5">
                        <h2 className="text-sm font-semibold text-white mb-4">Growth Over Time</h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={series}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "Years", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }} />
                                <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatRupee(v)} width={72} />
                                <Tooltip formatter={(v: number) => formatRupee(v)} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                                <Area type="monotone" dataKey="corpus" name="Corpus" stroke="#6366f1" fill="rgba(99,102,241,0.15)" strokeWidth={2} />
                                <Area type="monotone" dataKey="invested" name="Invested" stroke="#10b981" fill="rgba(16,185,129,0.1)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="glass p-5 flex items-center justify-center">
                        <div>
                            <h2 className="text-sm font-semibold text-white mb-4 text-center">Invested vs Gains</h2>
                            <PieChart width={200} height={200}>
                                <Pie data={pieData} cx={100} cy={100} innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => formatRupee(v)} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                            </PieChart>
                            <div className="flex gap-4 justify-center text-xs">
                                {pieData.map((d) => (
                                    <div key={d.name} className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                                        <span className="text-slate-400">{d.name}: {formatRupee(d.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
