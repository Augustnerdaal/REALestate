import React, { useState } from 'react';

export type PageLink = { id: string; label: string; locked?: boolean };

export default function NavBar({ pages, activePage, setActivePage }:{ pages: PageLink[]; activePage: string; setActivePage:(id:string)=>void }){
  const [shakeTarget, setShakeTarget] = useState<string | null>(null);
  const click = (id: string, locked?: boolean) => {
    if (locked) { setShakeTarget(id); setTimeout(()=>setShakeTarget(null),500); return; }
    setActivePage(id);
  };
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg flex justify-around py-3 px-4 z-50">
      {pages.map(p => {
        const active = activePage === p.id;
        const locked = p.locked;
        return (
          <button key={p.id} onClick={()=>click(p.id, locked)} disabled={locked}
            className={`relative px-4 py-2 rounded-xl transition-all ${active ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-[length:200%_200%] animate-gradientShift text-white shadow-lg animate-glow' : locked ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-white/5'} ${shakeTarget===p.id ? 'animate-shake':''}`}
            title={locked ? 'Fyll i uppgifter först' : p.label}
          >{p.label}</button>
        );
      })}
    </nav>
  );
}
