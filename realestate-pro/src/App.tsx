import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Start from '@/pages/Start';
import Analysis from '@/pages/Analysis';
import Scenario from '@/pages/Scenario';
import Projects from '@/pages/Projects';
import type { InputData } from '@/lib/calculations';

type Page = 'projects' | 'start' | 'analysis' | 'scenario';

export default function App(){
  const [page, setPage] = useState<Page>('start');
  const [data, setData] = useState<InputData | null>(null);
  const [projects, setProjects] = useState<{id:string; data:InputData; created:string}[]>([]);

  // load/save projects from localStorage
  useEffect(()=>{
    const raw = localStorage.getItem('re-pro-projects');
    if (raw) setProjects(JSON.parse(raw));
  },[]);
  useEffect(()=>{
    localStorage.setItem('re-pro-projects', JSON.stringify(projects));
  },[projects]);

  const pages = [
    { id:'projects', label:'Projekt' },
    { id:'start', label:'Start' },
    { id:'analysis', label:'Analys', locked: !data },
    { id:'scenario', label:'Scenario', locked: !data },
  ];

  const createProjectFromData = (d: InputData) => {
    const id = Math.random().toString(36).slice(2,7);
    const item = { id, data: d, created: new Date().toISOString() };
    setProjects(p => [item, ...p]);
    return id;
  };

  const openProject = (id: string) => {
    const item = projects.find(p=>p.id===id);
    if (!item) return;
    setData(item.data);
    setPage('analysis');
  };

  const removeProject = (id: string) => setProjects(p=>p.filter(x=>x.id!==id));

  return (
    <div className="min-h-screen text-white pb-28">
      <main className="flex-1 p-6">
        {page==='projects' && <Projects items={projects} open={openProject} remove={removeProject} />}
        {page==='start' && <Start onSubmit={(values)=>{ setData(values); setPage('analysis'); createProjectFromData(values);} } />}
        {page==='analysis' && data && <Analysis data={data} setPage={(p)=>setPage(p as Page)} />}
        {page==='scenario' && data && <Scenario data={data} setData={(d)=>{ setData(d); }} />}
      </main>
      <NavBar pages={pages} activePage={page} setActivePage={(id)=>{
        if ((id==='analysis' || id==='scenario') && !data) return;
        setPage(id as Page);
      }} />
    </div>
  );
}
