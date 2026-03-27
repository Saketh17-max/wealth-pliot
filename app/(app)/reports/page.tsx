"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { formatRupee, sipFutureValue, fireNumber } from "@/lib/calculators";
import { niftyCagr } from "@/lib/nifty-data";

const DEMO = {
    name: "Demo User",
    income: 100000,
    expenses: 60000,
    savings: 40000,
    portfolio: 2000000,
    goals: [
        { name: "Retirement", target: 5000000, current: 1240000, year: 2040 },
        { name: "Child Education", target: 2000000, current: 380000, year: 2032 },
        { name: "Emergency Fund", target: 300000, current: 280000, year: 2025 },
    ],
    risk: "Moderate",
    efMonths: 4,
};

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false);

    const projected = sipFutureValue(DEMO.savings, 12, 15);
    const fireNum = fireNumber(DEMO.expenses * 12);
    const cagr10 = niftyCagr(10).toFixed(1);

    function handlePrint() {
        setGenerating(true);
        setTimeout(() => {
            window.print();
            setGenerating(false);
        }, 200);
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="text-indigo-400" size={24} />Financial Health Report</h1>
                    <p className="text-slate-400 text-sm">Your comprehensive financial snapshot</p>
                </div>
                <button onClick={handlePrint} disabled={generating} className="btn-primary text-sm">
                    <Download size={16} />
                    {generating ? "Generating..." : "Print / Save PDF"}
                </button>
            </div>

            {/* Report Content */}
            <div id="report" className="space-y-5">
                {/* Header */}
                <div className="glass p-6 text-center gradient-text">
                    <div className="text-3xl font-bold">WealthPilot AI — Financial Health Report</div>
                    <div className="text-sm text-slate-400 mt-1">{new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
                </div>

                {/* Net Worth Summary */}
                <div className="glass p-5">
                    <h2 className="text-base font-bold text-white mb-4">💰 Net Worth Summary</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-white">{formatRupee(DEMO.portfolio)}</div>
                            <div className="text-xs text-slate-400">Total Portfolio</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-emerald-400">₹{DEMO.savings.toLocaleString()}</div>
                            <div className="text-xs text-slate-400">Monthly Savings</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-indigo-400">{((DEMO.savings / DEMO.income) * 100).toFixed(0)}%</div>
                            <div className="text-xs text-slate-400">Savings Rate</div>
                        </div>
                    </div>
                </div>

                {/* Goals Status */}
                <div className="glass p-5">
                    <h2 className="text-base font-bold text-white mb-4">🎯 Goals Progress</h2>
                    <div className="space-y-3">
                        {DEMO.goals.map((g) => {
                            const pct = Math.min(100, (g.current / g.target) * 100);
                            return (
                                <div key={g.name} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white">{g.name}</span>
                                        <span className="text-slate-400">{formatRupee(g.current)} / {formatRupee(g.target)} ({pct.toFixed(0)}%)</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AI Insights Summary */}
                <div className="glass p-5">
                    <h2 className="text-base font-bold text-white mb-4">🤖 AI Recommendations</h2>
                    <div className="space-y-2 text-sm">
                        {[
                            { type: "warning", text: `Emergency fund is only ${DEMO.efMonths} months. Build up to 6 months (${formatRupee(DEMO.expenses * 6)}).` },
                            { type: "info", text: "Tax saving: Maximize Section 80C (₹1.5L ELSS) and 80CCD (₹50K NPS) for up to ₹46,800 savings." },
                            { type: "success", text: `At 12% p.a., your ₹40K/month SIP will grow to ${formatRupee(projected)} in 15 years.` },
                            { type: "info", text: `FIRE number at 4% SWR: ${formatRupee(fireNum)} — current portfolio covers ${((DEMO.portfolio / fireNum) * 100).toFixed(0)}%.` },
                        ].map((insight, i) => (
                            <div key={i} className={`flex gap-2 p-3 rounded-xl ${insight.type === "warning" ? "bg-amber-500/10 text-amber-300" : insight.type === "success" ? "bg-emerald-500/10 text-emerald-300" : "bg-indigo-500/10 text-indigo-300"}`}>
                                <span>{insight.type === "warning" ? "⚠️" : insight.type === "success" ? "✅" : "💡"}</span>
                                <span>{insight.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Market Benchmarks */}
                <div className="glass p-5">
                    <h2 className="text-base font-bold text-white mb-4">📊 Market Benchmarks</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-indigo-400">{cagr10}%</div>
                            <div className="text-xs text-slate-400">NIFTY 50 10Y CAGR</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-emerald-400">12%</div>
                            <div className="text-xs text-slate-400">Your Target Return</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-amber-400">Moderate</div>
                            <div className="text-xs text-slate-400">Risk Profile</div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="glass p-4 text-center">
                    <p className="text-xs text-slate-500">
                        ⚠️ This report is generated by WealthPilot AI for informational purposes only. It does not constitute financial advice.
                        Past performance is not indicative of future results. Please consult a SEBI-registered financial advisor before making investment decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
