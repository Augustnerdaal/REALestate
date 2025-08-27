export type InputData = {
  fastighet: string;
  kopesumma: number;
  hyra: number;
  drift: number;
  lan: number;
  ranta: number;
  egetKapital: number;
  skatt?: number;
  vakans?: number;
  inflation?: number;
  amortering?: number;
  exitYield?: number; // %
};

export const SEK = (v: number) =>
  (isFinite(v) ? v : 0).toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });

export const PCT = (v: number) => `${(isFinite(v) ? v * 100 : 0).toFixed(1)} %`;

export function kpis(d: InputData) {
  const effektivaIntakter = d.hyra * (1 - (d.vakans || 0) / 100);
  const NOI = effektivaIntakter - d.drift;
  const rantekostnad = (d.lan * d.ranta) / 100;
  const amort = ((d.amortering || 0) / 100) * d.lan;
  const cfBeforeTax = NOI - rantekostnad - amort;
  const tax = ((d.skatt || 0) / 100) * Math.max(cfBeforeTax, 0);
  const cf = cfBeforeTax - tax;

  const capRate = d.kopesumma ? NOI / d.kopesumma : 0;
  const ROI = d.egetKapital ? cf / d.egetKapital : 0;
  const LTV = d.kopesumma ? d.lan / d.kopesumma : 0;
  const payback = cf !== 0 ? d.egetKapital / cf : Infinity;
  const breakEvenRent = d.drift + rantekostnad + amort;
  const breakEvenRate = d.lan ? Math.max(0, ((NOI - amort) / d.lan) * 100) : 0; // %
  const exitYield = d.exitYield ?? 5;
  const exitValue = exitYield > 0 ? NOI / (exitYield / 100) : 0;

  return { effektivaIntakter, NOI, rantekostnad, amort, cfBeforeTax, tax, cf, capRate, ROI, LTV, payback, breakEvenRent, breakEvenRate, exitValue };
}

export function forecast(d: InputData, years = 10) {
  const infl = (d.inflation || 0) / 100;
  let loan = d.lan;
  const rows: { year: number; hyra: number; drift: number; NOI: number; ranta: number; amort: number; cf: number; loan: number }[] = [];
  for (let y = 1; y <= years; y++) {
    const hyraY = d.hyra * Math.pow(1 + infl, y - 1) * (1 - (d.vakans || 0) / 100);
    const driftY = d.drift * Math.pow(1 + infl, y - 1);
    const NOI = hyraY - driftY;
    const rantekostnad = (loan * d.ranta) / 100;
    const amort = ((d.amortering || 0) / 100) * loan;
    const base = NOI - rantekostnad - amort;
    const tax = ((d.skatt || 0) / 100) * Math.max(base, 0);
    const cf = base - tax;
    rows.push({ year: y, hyra: hyraY, drift: driftY, NOI, ranta: rantekostnad, amort, cf, loan });
    loan = Math.max(0, loan - amort);
  }
  return rows;
}

export function equityMultiple(initialEquity: number, annualCF: number[], exitProceeds: number) {
  const totalBack = annualCF.reduce((a,b)=>a+b,0) + exitProceeds;
  return initialEquity > 0 ? totalBack / initialEquity : 0;
}

// IRR using bisection method
export function irr(cashflows: number[], iterations = 100): number {
  let low = -0.99, high = 1.0;
  const npv = (r: number) => cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + r, i), 0);
  for (let i = 0; i < iterations; i++) {
    const mid = (low + high) / 2;
    const v = npv(mid);
    if (Math.abs(v) < 1e-7) return mid;
    if (v > 0) low = mid; else high = mid;
  }
  return (low + high) / 2;
}
