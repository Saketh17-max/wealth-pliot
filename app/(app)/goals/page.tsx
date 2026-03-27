"use client";

import { useState } from "react";
import { PlusCircle, Target, Trash2, TrendingUp } from "lucide-react";
import { formatRupee, sipFutureValue, requiredSIP } from "@/lib/calculators";
import type { Goal, GoalCategory, RiskLevel } from "@/lib/types";

const DEMO_GOALS: Goal[] = [
    { id: "1", name: "Retirement", category: "retirement", targetAmount: 5000000, targetYear: 2040, currentSavings: 1240000, monthlyContribution: 10000, riskLevel: "moderate", createdAt: Date.now() },
    { id: "2", name: "Child Education", category: "education", targetAmount: 2000000, targetYear: 2032, currentSavings: 380000, monthlyContribution: 5000, riskLevel: "moderate", createdAt: Date.now() },
];

const RATE: Record<RiskLevel, number> = { conservative: 8, moderate: 12, aggressive: 15 };
const CATEGORIES: GoalCategory[] = ["retirement", "education", "house", "travel", "emergency", "wealth", "other"];

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        category: "wealth" as GoalCategory,
        targetAmount: "",
        targetYear: String(new Date().getFullYear() + 10),
        currentSavings: "",
        monthlyContribution: "",
        riskLevel: "moderate" as RiskLevel,
    });

    function addGoal() {
        if (!form.name || !form.targetAmount) return;
        const goal: Goal = {
            id: String(Date.now()),
            name: form.name,
            category: form.category,
            targetAmount: Number(form.targetAmount),
            targetYear: Number(form.targetYear),
            currentSavings: Number(form.currentSavings) || 0,
            monthlyContribution: Number(form.monthlyContribution) || 0,
            riskLevel: form.riskLevel,
            createdAt: Date.now(),
        };
        setGoals([...goals, goal]);
        setShowForm(false);
        setForm({ name: "", category: "wealth", targetAmount: "", targetYear: String(new Date().getFullYear() + 10), currentSavings: "", monthlyContribution: "", riskLevel: "moderate" });
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
                    <p className="text-slate-400 text-sm">Set, track, and achieve your financial milestones</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
                    <PlusCircle size={16} />
                    Add Goal
                </button>
            </div>

            {showForm && (
                <div className="glass p-6 space-y-4 border border-indigo-500/30">
                    <h2 className="text-base font-semibold text-white">New Goal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Goal Name</label>
                            <input className="input-dark" placeholder="e.g. Dream Home" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Category</label>
                            <select className="input-dark" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as GoalCategory })}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Target Amount (₹)</label>
                            <input className="input-dark" type="number" placeholder="5000000" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Target Year</label>
                            <input className="input-dark" type="number" min="2025" max="2060" value={form.targetYear} onChange={(e) => setForm({ ...form, targetYear: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Current Savings (₹)</label>
                            <input className="input-dark" type="number" placeholder="0" value={form.currentSavings} onChange={(e) => setForm({ ...form, currentSavings: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Monthly SIP (₹)</label>
                            <input className="input-dark" type="number" placeholder="5000" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Risk Profile</label>
                            <select className="input-dark" value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value as RiskLevel })}>
                                <option value="conservative">Conservative (8% p.a.)</option>
                                <option value="moderate">Moderate (12% p.a.)</option>
                                <option value="aggressive">Aggressive (15% p.a.)</option>
                            </select>
                        </div>
                    </div>
                    {form.targetAmount && form.monthlyContribution && (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300">
                            <strong>AI Summary:</strong> At {RATE[form.riskLevel]}% p.a., your ₹{Number(form.monthlyContribution).toLocaleString()}/mo SIP will grow to{" "}
                            <strong>{formatRupee(sipFutureValue(Number(form.monthlyContribution), RATE[form.riskLevel], Number(form.targetYear) - new Date().getFullYear()))}</strong>{" "}
                            by {form.targetYear}. Required SIP to hit exact target:{" "}
                            <strong>{formatRupee(requiredSIP(Number(form.targetAmount) - Number(form.currentSavings || 0), RATE[form.riskLevel], Number(form.targetYear) - new Date().getFullYear()))}</strong>/mo.
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button onClick={addGoal} className="btn-primary text-sm">Save Goal</button>
                        <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {goals.map((goal) => {
                    const years = goal.targetYear - new Date().getFullYear();
                    const rate = RATE[goal.riskLevel];
                    const projectedValue = sipFutureValue(goal.monthlyContribution, rate, Math.max(0, years)) + goal.currentSavings * (1 + rate / 100) ** Math.max(0, years);
                    const pct = Math.min(100, (goal.currentSavings / goal.targetAmount) * 100);
                    const onTrack = projectedValue >= goal.targetAmount;
                    return (
                        <div key={goal.id} className="glass glass-hover p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Target size={16} className="text-indigo-400" />
                                        <span className="font-semibold text-white">{goal.name}</span>
                                        <span className={`badge ${onTrack ? "badge-emerald" : "badge-amber"}`}>{onTrack ? "On Track" : "Gap"}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">{goal.category} · {goal.riskLevel} · Target {goal.targetYear}</div>
                                </div>
                                <button onClick={() => setGoals(goals.filter((g) => g.id !== goal.id))} className="text-slate-600 hover:text-rose-400 transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <div className="text-slate-500 text-xs">Target</div>
                                    <div className="text-white font-semibold">{formatRupee(goal.targetAmount)}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs">Saved So Far</div>
                                    <div className="text-white font-semibold">{formatRupee(goal.currentSavings)}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs">Monthly SIP</div>
                                    <div className="text-white font-semibold">₹{goal.monthlyContribution.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs">Projected Value</div>
                                    <div className={`font-semibold ${onTrack ? "text-emerald-400" : "text-amber-400"}`}>{formatRupee(projectedValue)}</div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>{pct.toFixed(1)}% funded</span>
                                    <span>{years} years remaining</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
