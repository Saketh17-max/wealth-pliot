// Financial calculators for WealthPilot

export function formatRupee(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/** SIP future value: FV = P * [((1 + r)^n - 1) / r] * (1 + r) */
export function sipFutureValue(monthly: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * (((1 + r) ** n - 1) / r) * (1 + r);
}

/** Lumpsum future value: FV = P * (1 + r)^n */
export function lumpsumFutureValue(principal: number, annualRate: number, years: number): number {
    return principal * (1 + annualRate / 100) ** years;
}

/** CAGR from start value to end value over n years */
export function cagr(start: number, end: number, years: number): number {
    return ((end / start) ** (1 / years) - 1) * 100;
}

/** Inflation-adjusted return */
export function realReturn(nominalRate: number, inflationRate: number): number {
    return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
}

/** Required monthly SIP to reach a target amount */
export function requiredSIP(targetAmount: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return targetAmount / n;
    return targetAmount / ((((1 + r) ** n - 1) / r) * (1 + r));
}

/** FIRE number: corpus needed based on annual expenses and SWR */
export function fireNumber(annualExpenses: number, safeWithdrawalRate = 4): number {
    return (annualExpenses * 100) / safeWithdrawalRate;
}

/** Corpus growth series for chart */
export function corpusGrowthSeries(
    monthlyInvestment: number,
    annualRate: number,
    years: number
): { year: number; value: number }[] {
    return Array.from({ length: years + 1 }, (_, i) => ({
        year: i,
        value: sipFutureValue(monthlyInvestment, annualRate, i),
    }));
}
