// Rule-based AI recommendation engine

import type { Goal, Asset, AIInsight, RiskLevel, RebalancingAction } from "./types";
import { formatRupee } from "./calculators";

const IDEAL_ALLOCATION: Record<string, Record<string, number>> = {
    conservative: { equity: 30, debt: 50, gold: 10, cash: 10 },
    moderate: { equity: 60, debt: 25, gold: 10, cash: 5 },
    aggressive: { equity: 80, debt: 10, gold: 5, cash: 5 },
};

export function generateInsights(
    goals: Goal[],
    portfolio: Asset[],
    monthlyIncome: number,
    monthlyExpenses: number,
    emergencyFundMonths: number,
    riskProfile: RiskLevel
): AIInsight[] {
    const insights: AIInsight[] = [];
    const totalPortfolio = portfolio.reduce((s, a) => s + a.currentValue, 0);

    // 1. Emergency fund check
    const monthlyFixed = monthlyExpenses;
    const emergencyTarget = monthlyFixed * 6;
    const cashAssets = portfolio.filter((a) => a.type === "cash" || a.type === "fd");
    const liquidFunds = cashAssets.reduce((s, a) => s + a.currentValue, 0);

    if (emergencyFundMonths < 3) {
        insights.push({
            id: "emergency-critical",
            type: "critical",
            title: "Critical: Emergency Fund Missing",
            description: `You have only ${emergencyFundMonths} month(s) of expenses covered. Build a liquid emergency fund of at least ${formatRupee(emergencyTarget)} (6 months).`,
            action: "Set up a high-yield savings account or liquid fund",
            priority: 1,
        });
    } else if (emergencyFundMonths < 6) {
        insights.push({
            id: "emergency-warning",
            type: "warning",
            title: "Insufficient Emergency Fund",
            description: `You have ${emergencyFundMonths} months covered. Aim for at least 6 months (${formatRupee(emergencyTarget)}).`,
            action: "Increase monthly savings to liquid assets",
            priority: 2,
        });
    } else {
        insights.push({
            id: "emergency-ok",
            type: "success",
            title: "Emergency Fund on Track",
            description: `You have ${emergencyFundMonths} months of expenses covered — excellent discipline!`,
            priority: 10,
        });
    }

    // 2. Risk mismatch
    const shortHorizonGoals = goals.filter((g) => g.targetYear - new Date().getFullYear() < 3);
    if (riskProfile === "aggressive" && shortHorizonGoals.length > 0) {
        insights.push({
            id: "risk-mismatch",
            type: "warning",
            title: "Risk Mismatch Detected",
            description: `You have ${shortHorizonGoals.length} goal(s) due in under 3 years but an aggressive risk profile. Equity can be volatile short-term.`,
            action: "Move short-term goals to debt/FD instruments",
            priority: 3,
        });
    }

    // 3. Growth opportunity for conservative long-term investors
    const longHorizonGoals = goals.filter((g) => g.targetYear - new Date().getFullYear() > 7);
    if (riskProfile === "conservative" && longHorizonGoals.length > 0) {
        insights.push({
            id: "growth-opportunity",
            type: "info",
            title: "Growth Opportunity Missed",
            description: "You have long-term goals but a conservative profile. Equity typically outperforms debt over 7+ year horizons.",
            action: "Consider increasing equity allocation to 50-60%",
            priority: 5,
        });
    }

    // 4. Gold overweight
    const goldAssets = portfolio.filter((a) => a.type === "gold");
    const goldValue = goldAssets.reduce((s, a) => s + a.currentValue, 0);
    const goldPct = totalPortfolio > 0 ? (goldValue / totalPortfolio) * 100 : 0;
    if (goldPct > 15) {
        insights.push({
            id: "gold-overweight",
            type: "warning",
            title: "Gold Overweight",
            description: `Gold is ${goldPct.toFixed(1)}% of your portfolio. Financial advisors recommend 5-10% max in gold as a hedge.`,
            action: "Trim gold and reallocate to equity mutual funds",
            priority: 4,
        });
    }

    // 5. Tax saving opportunity
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    if (savingsRate > 20) {
        insights.push({
            id: "tax-saving",
            type: "info",
            title: "Tax Saving Opportunity",
            description: "You have good cash flow. Maximize Section 80C (₹1.5L), 80CCD (₹50K NPS) and 80D (₹25K health insurance) deductions.",
            action: "Invest in ELSS / NPS / PPF to save up to ₹46,800 in tax",
            priority: 6,
        });
    }

    // 6. Idle cash
    const cashPct = totalPortfolio > 0 ? (liquidFunds / totalPortfolio) * 100 : 0;
    if (cashPct > 20) {
        insights.push({
            id: "idle-cash",
            type: "warning",
            title: "Too Much Idle Cash",
            description: `${cashPct.toFixed(1)}% of your portfolio is in cash/FD — inflation is eroding its value.`,
            action: "Deploy excess cash into diversified equity mutual funds",
            priority: 4,
        });
    }

    // 7. Portfolio too concentrated
    if (portfolio.length > 0 && portfolio.length < 3) {
        insights.push({
            id: "concentration-risk",
            type: "warning",
            title: "Concentration Risk",
            description: "Your portfolio has fewer than 3 asset types. Diversification reduces risk without sacrificing much return.",
            action: "Add at least 4-5 different asset classes",
            priority: 5,
        });
    }

    return insights.sort((a, b) => a.priority - b.priority);
}

export function calculateRiskScore(
    riskProfile: RiskLevel,
    emergencyFundMonths: number,
    goldPct: number,
    savingsRate: number
): number {
    let score = riskProfile === "aggressive" ? 70 : riskProfile === "moderate" ? 45 : 25;
    if (emergencyFundMonths < 3) score += 15;
    if (emergencyFundMonths >= 6) score -= 10;
    if (goldPct > 15) score += 5;
    if (savingsRate > 30) score -= 5;
    return Math.max(0, Math.min(100, score));
}

export function calculateRebalancing(
    portfolio: Asset[],
    riskProfile: RiskLevel
): RebalancingAction[] {
    const ideal = IDEAL_ALLOCATION[riskProfile];
    const total = portfolio.reduce((s, a) => s + a.currentValue, 0);
    if (total === 0) return [];

    const currentAlloc: Record<string, number> = {};
    for (const asset of portfolio) {
        const cat = asset.type === "equity" ? "equity"
            : asset.type === "gold" ? "gold"
                : asset.type === "cash" || asset.type === "fd" ? "cash"
                    : "debt";
        currentAlloc[cat] = (currentAlloc[cat] || 0) + (asset.currentValue / total) * 100;
    }

    return Object.entries(ideal).map(([cat, idealPct]) => {
        const currentPct = currentAlloc[cat] || 0;
        const diff = idealPct - currentPct;
        const amountDiff = (diff / 100) * total;
        return {
            asset: cat.charAt(0).toUpperCase() + cat.slice(1),
            current: Math.round(currentPct * 10) / 10,
            ideal: idealPct,
            action: diff > 1 ? "buy" : diff < -1 ? "sell" : "hold",
            amount: Math.abs(Math.round(amountDiff)),
        };
    });
}
