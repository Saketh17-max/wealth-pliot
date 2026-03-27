"use client";

import { useState, useMemo } from "react";
import { Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { sipFutureValue, fireNumber, formatRupee } from "@/lib/calculators";

export default function FirePage() {
    const [age, setAge] = useState(30);
    const [fireAge, setFireAge] = useState(45);
    const [monthlyExpenses, setMonthlyExpenses] = useState(60000);
    const [monthlyInvestment, setMonthlyInvestment] = useState(40000);
    const [currentCorpus, setCurrentCorpus] = useState(1000000);
    const [rate, setRate] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);
    const [swr, setSwr] = useState(4);

    const years = fireAge - age;
    const annualExpenses = monthlyExpenses * 12;
    const inflationAdjExpenses = annualExpenses * (1 + inflationRate / 100) ** years;
    const targetCorpus = fireNumber(inflationAdjExpenses, swr);
    const sipGrowth = sipFutureValue(monthlyInvestment, rate, Math.max(0, years));
    const lumpsumGrowth = currentCorpus * (1 + rate / 100) ** Math.max(0, years);
    const projectedCorpus = sipGrowth + lumpsumGrowth;
    const gap = targetCorpus - projectedCorpus;
    const onTrack = projectedCorpus >= targetCorpus;

    const series = useMemo(() => {
        return Array.from({ length: Math.max(1, years + 1) }, (_, i) => ({
            year: age + i,
            corpus: Math.round(sipFutureValue(monthlyInvestment, rate, i) + currentCorpus * (1 + rate / 100) ** i),
            target: Math.round(fireNumber(annualExpenses * (1 + inflationRate / 100) ** i, swr)),
        }));
    }, [monthlyInvestment, rate, currentCorpus, annualExpenses, inflationRate, swr, age, years]);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Flame className="text-orange-400" size={24} />FIRE Planner
                </h1>
                <p className="text-slate-400 text-sm">Financial Independence, Retire Early — plan your path to freedom</p>
            </div>

            {/* Config */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">FIRE Parameters</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Current Age", value: age, min: 18, max: 65, onChange: setAge },
                        { label: "FIRE Target Age", value: fireAge, min: 25, max: 70, onChange: setFireAge },
                        { label: "Monthly Expenses (₹)", value: monthlyExpenses, min: 10000, max: 500000, step: 5000, onChange: setMonthlyExpenses },
                        { label: "Monthly Investment (₹)", value: monthlyInvestment, min: 1000, max: 500000, step: 1000, onChange: setMonthlyInvestment },
                        { label: "Current Corpus (₹)", value: currentCorpus, min: 0, max: 50000000, step: 100000, onChange: setCurrentCorpus },
                        { label: "Expected Return (%)", value: rate, min: 4, max: 20, step: 0.5, onChange: setRate },
                        { label: "Inflation Rate (%)", value: inflationRate, min: 2, max: 12, step: 0.5, onChange: setInflationRate },
                        { label: "Safe Withdrawal Rate (%)", value: swr, min: 2, max: 6, step: 0.5, onChange: setSwr },
                    ].map((p) => (
                        <div key={p.label}>
                            <label className="text-xs text-slate-400 block mb-1">{p.label} ({typeof p.value === "number" && p.value > 1000 ? formatRupee(p.value) : p.value})</label>
                            <input
                                className="w-full accent-orange-500"
                                type="range"
                                min={p.min}
                                max={p.max}
                                step={p.step || 1}
                                value={p.value}
                                onChange={(e) => p.onChange(Number(e.target.value))}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "FIRE Number", value: formatRupee(targetCorpus), color: "text-orange-400" },
                    { label: "Projected Corpus", value: formatRupee(projectedCorpus), color: onTrack ? "text-emerald-400" : "text-amber-400" },
                    { label: "Gap / Surplus", value: `${onTrack ? "+" : "-"}${formatRupee(Math.abs(gap))}`, color: onTrack ? "text-emerald-400" : "text-rose-400" },
                    { label: "Years to FIRE", value: `${years} yrs`, color: "text-indigo-400" },
                ].map((s) => (
                    <div key={s.label} className="glass p-4 text-center">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {onTrack ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-sm text-center">
                    🎉 You are on track to FIRE at age {fireAge}! Your projected corpus exceeds the target by {formatRupee(Math.abs(gap))}.
                </div>
            ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm text-center">
                    ⚠️ You have a gap of {formatRupee(Math.abs(gap))}. Consider increasing your monthly investment or extending your FIRE age.
                </div>
            )}

            {/* Chart */}
            <div className="glass p-5">
                <h2 className="text-sm font-semibold text-white mb-4">Corpus Growth vs FIRE Target</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={series}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "Age", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }} />
                        <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatRupee(v)} width={72} />
                        <Tooltip formatter={(v: number) => formatRupee(v)} contentStyle={{ background: "#0a1628", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10 }} />
                        <ReferenceLine x={fireAge} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "FIRE Age", fill: "#f59e0b", fontSize: 11 }} />
                        <Area type="monotone" dataKey="corpus" name="Your Corpus" stroke="#f97316" fill="rgba(249,115,22,0.15)" strokeWidth={2} />
                        <Area type="monotone" dataKey="target" name="FIRE Target" stroke="#6366f1" fill="rgba(99,102,241,0.1)" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
