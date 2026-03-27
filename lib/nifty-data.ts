// Mock NIFTY 50 historical data (2005–2024)

export interface NiftyDataPoint {
    year: number;
    return: number; // annual return %
    absoluteValue: number; // index value at year end (~100 base at 2005)
}

export const niftyHistoricalData: NiftyDataPoint[] = [
    { year: 2005, return: 36.3, absoluteValue: 2836 },
    { year: 2006, return: 39.8, absoluteValue: 3966 },
    { year: 2007, return: 54.8, absoluteValue: 6138 },
    { year: 2008, return: -51.8, absoluteValue: 2959 },
    { year: 2009, return: 75.8, absoluteValue: 5201 },
    { year: 2010, return: 17.9, absoluteValue: 6134 },
    { year: 2011, return: -24.6, absoluteValue: 4624 },
    { year: 2012, return: 27.7, absoluteValue: 5905 },
    { year: 2013, return: 6.8, absoluteValue: 6304 },
    { year: 2014, return: 31.4, absoluteValue: 8283 },
    { year: 2015, return: -4.1, absoluteValue: 7946 },
    { year: 2016, return: 3.0, absoluteValue: 8185 },
    { year: 2017, return: 28.6, absoluteValue: 10530 },
    { year: 2018, return: 3.2, absoluteValue: 10863 },
    { year: 2019, return: 12.0, absoluteValue: 12168 },
    { year: 2020, return: 14.9, absoluteValue: 13982 },
    { year: 2021, return: 24.1, absoluteValue: 17354 },
    { year: 2022, return: 4.3, absoluteValue: 18105 },
    { year: 2023, return: 19.7, absoluteValue: 21682 },
    { year: 2024, return: 8.8, absoluteValue: 23577 },
];

/** CAGR over last N years */
export function niftyCagr(years: number): number {
    const data = niftyHistoricalData;
    const end = data[data.length - 1];
    const start = data[Math.max(0, data.length - 1 - years)];
    const actualYears = end.year - start.year;
    if (actualYears <= 0) return 0;
    return ((end.absoluteValue / start.absoluteValue) ** (1 / actualYears) - 1) * 100;
}

/** SIP growth vs lumpsum vs benchmark for chart */
export function marketComparisonData(years: number, monthlyAmount: number) {
    const data = niftyHistoricalData.slice(-years);
    let sipCorpus = 0;
    let lumpsumCorpus = monthlyAmount * 12; // lumpsum = 1 year of SIP invested once
    const series: { year: number; sip: number; lumpsum: number; nifty: number }[] = [];

    for (let i = 0; i < data.length; i++) {
        const annualReturn = data[i].return / 100;
        sipCorpus = (sipCorpus + monthlyAmount * 12) * (1 + annualReturn);
        lumpsumCorpus = lumpsumCorpus * (1 + annualReturn);
        series.push({
            year: data[i].year,
            sip: Math.round(sipCorpus),
            lumpsum: Math.round(lumpsumCorpus),
            nifty: data[i].absoluteValue,
        });
    }
    return series;
}
