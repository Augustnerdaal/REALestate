import React from 'react';
import Button from '@/components/Button';
import type { InputData } from '@/lib/calculations';
import { SEK } from '@/lib/calculations';

export default function Projects({ items, open, remove }:{ items:{id:string; data:InputData; created:string}[]; open:(id:string)=>void; remove:(id:string)=>void }){
  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-light">Projekt</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length===0 ? <p className="text-gray-400">Inga sparade projekt.</p> : items.map(p=> (
          <div key={p.id} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10">
            <div className="text-xl font-semibold mb-1">{p.data.fastighet}</div>
            <div className="text-gray-400 text-sm">Köpeskilling: {SEK(p.data.kopesumma)}</div>
            <div className="text-gray-500 text-xs mb-4">Skapad: {new Date(p.created).toLocaleString('sv-SE')}</div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={()=>open(p.id)}>Öppna</Button>
              <Button variant="secondary" onClick={()=>remove(p.id)}>Ta bort</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
