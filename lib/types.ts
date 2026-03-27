// Shared TypeScript types for WealthPilot

export type RiskLevel = "conservative" | "moderate" | "aggressive";
export type GoalCategory = "retirement" | "education" | "house" | "travel" | "emergency" | "wealth" | "other";
export type AssetType = "equity" | "debt" | "gold" | "real-estate" | "fd" | "ppf" | "crypto" | "cash";

export interface Goal {
    id: string;
    name: string;
    category: GoalCategory;
    targetAmount: number;
    targetYear: number;
    currentSavings: number;
    monthlyContribution: number;
    riskLevel: RiskLevel;
    createdAt: number;
}

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    currentValue: number;
    investedAmount: number;
    allocation?: number; // percentage
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    emergencyFundMonths?: number;
    riskProfile?: RiskLevel;
    goals?: Goal[];
    portfolio?: Asset[];
}

export interface AIInsight {
    id: string;
    type: "warning" | "success" | "info" | "critical";
    title: string;
    description: string;
    action?: string;
    priority: number;
}

export interface RebalancingAction {
    asset: string;
    current: number;
    ideal: number;
    action: "buy" | "sell" | "hold";
    amount: number;
}
