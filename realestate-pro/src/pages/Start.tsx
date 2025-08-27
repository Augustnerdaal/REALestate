import React, { useState } from 'react';
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import type { InputData } from '@/lib/calculations';

export default function Start({ onSubmit }:{ onSubmit:(d: InputData)=>void }){
  const [form, setForm] = useState<any>({
    fastighet:'', kopesumma:'', hyra:'', drift:'', lan:'', ranta:'3.5', egetKapital:'',
    skatt:'20', vakans:'5', inflation:'2', amortering:'2', exitYield:'5'
  });
  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm((f:any)=>({...f, [e.target.name]: e.target.value}));
  const field = (name:string, label:string, ph='', type: React.HTMLInputTypeAttribute='text', hint?:string) => (
    <div>
      <label className="block text-sm text-gray-300">{label} {hint && <span className="text-gray-500" title={hint}>?</span>}</label>
      <input name={name} value={form[name]??''} onChange={change} placeholder={ph} type={type}
        className="w-full p-3 mt-1 rounded-xl bg-black/40 border border-white/20 focus:outline-none" />
    </div>
  );
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const toNum = (v:string)=> parseFloat(v||'0');
    const payload: InputData = {
      fastighet: form.fastighet || 'Fastighet',
      kopesumma: toNum(form.kopesumma), hyra: toNum(form.hyra), drift: toNum(form.drift),
      lan: toNum(form.lan), ranta: toNum(form.ranta), egetKapital: toNum(form.egetKapital),
      skatt: toNum(form.skatt), vakans: toNum(form.vakans), inflation: toNum(form.inflation),
      amortering: toNum(form.amortering), exitYield: toNum(form.exitYield)
    };
    onSubmit(payload);
  };
  return (
    <form onSubmit={submit} className="w-full max-w-6xl mx-auto mt-12 p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
      <h1 className="text-3xl font-light mb-2">Fastighetsanalys</h1>
      <p className="text-gray-400 mb-8">Fyll i detaljer. Exempelvis <Tooltip term="ROI" text="Return on Investment: avkastning på eget kapital i procent."/> beräknas senare.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {field('fastighet','Fastighetsnamn','Fabriken 12')}
        {field('kopesumma','Köpeskilling (kr)','12 500 000','number')}
        {field('egetKapital','Eget kapital (kr)','3 000 000','number')}
        {field('hyra','Hyresintäkter (kr/år)','1 800 000','number')}
        {field('drift','Driftkostnader (kr/år)','650 000','number')}
        {field('lan','Lån (kr)','9 500 000','number')}
        {field('ranta','Ränta (%)','4.25','number','Årlig nominell ränta')}
        {field('amortering','Amortering (% av lån/år)','2','number','Rak amortering, förenklad')}
        {field('skatt','Skatt (%)','20','number','På positivt kassaflöde')}
        {field('vakans','Vakans (%)','5','number','Tomställd andel')}
        {field('inflation','Index/Inflation (%)','2','number','Årlig uppräkning hyra/drift')}
        {field('exitYield','Exit yield (%)','5','number','Avkastningskrav vid försäljning')}
      </div>
      <div className="mt-8"><Button variant="primary" type="submit">Nästa →</Button></div>
    </form>
  );
}
