import React, { useMemo } from 'react';
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import { kpis, forecast, SEK, PCT, InputData, irr, equityMultiple } from '@/lib/calculations';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import jsPDF from 'jspdf';

export default function Analysis({ data, setPage }:{ data: InputData; setPage:(p:string)=>void }){
  const K = useMemo(()=>kpis(data), [data]);
  const rows = useMemo(()=>forecast(data, 10), [data]);

  // Build IRR & Equity multiple using 10y cf + exit proceeds
  const exitProceeds = (data.exitYield && data.exitYield>0) ? (rows[rows.length-1].NOI)/(data.exitYield/100) - rows[rows.length-1].loan : 0;
  const cashflows = [-data.egetKapital, ...rows.map(r=>r.cf), exitProceeds];
  const IRR = irr(cashflows);
  const EM = equityMultiple(data.egetKapital, rows.map(r=>r.cf), exitProceeds);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.text('Fastighetsrapport', 20, 20);
    doc.setFontSize(12);
    const lines = [
      `Fastighet: ${data.fastighet}`,
      `Köpeskilling: ${SEK(data.kopesumma)}`,
      `Eget kapital: ${SEK(data.egetKapital)} | Lån: ${SEK(data.lan)} | LTV: ${PCT(K.LTV)}`,
      `Hyra: ${SEK(data.hyra)} | Drift: ${SEK(data.drift)} | Vakans: ${data.vakans ?? 0}%`,
      `Ränta: ${data.ranta}% | Amort: ${data.amortering ?? 0}% | Skatt: ${data.skatt ?? 0}%`,
      `Exit yield: ${data.exitYield ?? 5}%`
    ];
    lines.forEach((t,i)=>doc.text(t,20,40+i*8));
    const start = 100;
    const stats = [
      ['NOI', SEK(K.NOI)], ['Kassaflöde (skatt)', SEK(K.cf)], ['Cap rate', PCT(K.capRate)],
      ['ROI', PCT(K.ROI)], ['Payback', isFinite(K.payback)? K.payback.toFixed(1)+' år' : '—'], ['Break-even hyra/år', SEK(K.breakEvenRent)],
      ['Break-even ränta', `${K.breakEvenRate.toFixed(2)} %`], ['Exit value (å1 NOI)', SEK(K.exitValue)],
      ['IRR (10 år)', `${(IRR*100).toFixed(2)} %`], ['Equity multiple', EM.toFixed(2)+'x']
    ];
    stats.forEach((row, i) => {
      doc.text(`${row[0]}: ${row[1]}`, 20, start + i*8);
    });
    doc.save(`rapport_${data.fastighet||'fastighet'}.pdf`);
  };

  const donut = [
    { name:'Intäkter', value: Math.max(K.effektivaIntakter,0) },
    { name:'Drift', value: Math.max(data.drift,0) },
    { name:'Ränta', value: Math.max(K.rantekostnad,0) },
    { name:'Amort', value: Math.max(K.amort,0) },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-light">Analys av {data.fastighet}</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={()=>setPage('start')}>Tillbaka</Button>
          <Button variant="secondary" onClick={exportPDF}>Exportera PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: <Tooltip term="NOI" text="Net Operating Income: intäkter minus drift."/>, value: SEK(K.NOI) },
          { label: <Tooltip term="Kassaflöde" text="Fritt kassaflöde efter ränta, amortering och skatt."/>, value: SEK(K.cf) },
          { label: <Tooltip term="Cap rate" text="NOI delat med marknadsvärde/köpeskilling."/>, value: PCT(K.capRate) },
          { label: <Tooltip term="ROI" text="Avkastning på eget kapital (CF / EK)."/>, value: PCT(K.ROI) },
          { label: <Tooltip term="LTV" text="Belåningsgrad = lån / värde."/>, value: PCT(K.LTV) },
          { label: <Tooltip term="Payback" text="År tills eget kapital är återbetalt via CF."/>, value: isFinite(K.payback)? K.payback.toFixed(1)+' år':'—' },
          { label: <Tooltip term="Break-even hyra" text="Hyresnivå där CF blir 0 (före skatt)."/>, value: SEK(K.breakEvenRent) },
          { label: <Tooltip term="Break-even ränta" text="Räntenivå där CF blir 0 (före skatt)."/>, value: `${K.breakEvenRate.toFixed(2)} %` },
          { label: <Tooltip term="Exit-värde" text="Värde beräknat på NOI / exit yield."/>, value: SEK(K.exitValue) },
          { label: <Tooltip term="IRR" text="Internränta på 10 år, inkl. exit."/>, value: `${(IRR*100).toFixed(2)} %` },
          { label: <Tooltip term="Equity multiple" text="Totalt kapital tillbaka / eget kapital."/>, value: `${EM.toFixed(2)}x` },
        ].map((c,i)=>(
          <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
            <div className="text-sm text-gray-300 mb-1">{c.label}</div>
            <div className="text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
          <h3 className="text-sm text-gray-300 mb-4">Kassaflöde över tid (10 år)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v)=> (v/1000).toFixed(0)+'k' } />
                <RTooltip formatter={(v:any)=>SEK(Number(v))} labelFormatter={(l)=>`År ${l}`} />
                <Area type="monotone" dataKey="cf" stroke="#a855f7" fill="url(#cf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
          <h3 className="text-sm text-gray-300 mb-4">Fördelning (år 1)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[...donut]} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {donut.map((_,i)=>(<Cell key={i} fill={["#22c55e","#f59e0b","#ef4444","#60a5fa"][i%4]} />))}
                </Pie>
                <Legend />
                <RTooltip formatter={(v:any)=>SEK(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
