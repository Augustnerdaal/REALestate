import React, { useState } from 'react';
import Button from '@/components/Button';
import { InputData, kpis, SEK, PCT } from '@/lib/calculations';

export default function Scenario({ data, setData }:{ data: InputData; setData:(d:InputData)=>void }){
  const [hyra, setHyra] = useState(data.hyra);
  const [drift, setDrift] = useState(data.drift);
  const [ranta, setRanta] = useState(data.ranta);
  const [vakans, setVakans] = useState(data.vakans ?? 5);
  const [amort, setAmort] = useState(data.amortering ?? 2);
  const [exitY, setExitY] = useState(data.exitYield ?? 5);

  const temp: InputData = { ...data, hyra, drift, ranta, vakans, amortering: amort, exitYield: exitY };
  const K = kpis(temp);

  const [saved, setSaved] = useState<{ id:string; label:string; d:InputData; k:ReturnType<typeof kpis> }[]>([]);
  const save = ()=> setSaved(s=>[...s, { id: Math.random().toString(36).slice(2,7), label:`S${s.length+1}`, d: temp, k: K }]);
  const remove = (id:string)=> setSaved(s=>s.filter(x=>x.id!==id));

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-light">Scenarioanalys</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={save}>Spara scenario</Button>
          <Button variant="secondary" onClick={()=>setData(temp)}>Använd i analys</Button>
        </div>
      </div>

      <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-gray-300 mb-1">Hyresintäkter: {SEK(hyra)}</label>
            <input type="range" min={data.hyra*0.5} max={data.hyra*1.5} step={1000} value={hyra} onChange={e=>setHyra(parseFloat(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Driftkostnader: {SEK(drift)}</label>
            <input type="range" min={data.drift*0.5} max={data.drift*1.5} step={1000} value={drift} onChange={e=>setDrift(parseFloat(e.target.value))} className="w-full accent-pink-500" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Ränta: {ranta.toFixed(2)} %</label>
            <input type="range" min={0} max={10} step={0.05} value={ranta} onChange={e=>setRanta(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Vakans: {vakans.toFixed(1)} %</label>
            <input type="range" min={0} max={30} step={0.5} value={vakans} onChange={e=>setVakans(parseFloat(e.target.value))} className="w-full accent-green-500" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Amortering: {amort.toFixed(1)} %</label>
            <input type="range" min={0} max={10} step={0.1} value={amort} onChange={e=>setAmort(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Exit yield: {exitY.toFixed(2)} %</label>
            <input type="range" min={3} max={10} step={0.05} value={exitY} onChange={e=>setExitY(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {label:'NOI', value: SEK(K.NOI)},
          {label:'Kassaflöde', value: SEK(K.cf)},
          {label:'ROI', value: PCT(K.ROI)},
          {label:'Cap rate', value: PCT(K.capRate)},
          {label:'LTV', value: PCT(K.LTV)},
          {label:'Break-even hyra', value: SEK(K.breakEvenRent)},
        ].map((c,i)=>(
          <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
            <div className="text-sm text-gray-300 mb-1">{c.label}</div>
            <div className="text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
        <h3 className="text-sm text-gray-300 mb-4">Sparade scenarier</h3>
        {saved.length===0 ? <p className="text-gray-400">Inga scenarier ännu.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2 pr-4">Scenario</th>
                  <th className="py-2 pr-4">Hyra</th>
                  <th className="py-2 pr-4">Drift</th>
                  <th className="py-2 pr-4">Ränta</th>
                  <th className="py-2 pr-4">NOI</th>
                  <th className="py-2 pr-4">CF</th>
                  <th className="py-2 pr-4">ROI</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {saved.map(s=>(
                  <tr key={s.id} className="border-t border-white/10">
                    <td className="py-2 pr-4">{s.label}</td>
                    <td className="py-2 pr-4">{SEK(s.d.hyra)}</td>
                    <td className="py-2 pr-4">{SEK(s.d.drift)}</td>
                    <td className="py-2 pr-4">{s.d.ranta.toFixed(2)} %</td>
                    <td className="py-2 pr-4">{SEK(s.k.NOI)}</td>
                    <td className="py-2 pr-4">{SEK(s.k.cf)}</td>
                    <td className="py-2 pr-4">{PCT(s.k.ROI)}</td>
                    <td className="py-2 pr-4"><button className="underline" onClick={()=>setData(s.d)}>Använd</button> <button className="underline" onClick={()=>remove(s.id)}>Ta bort</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
