
import React, { useState } from 'react';
import { BudgetProject } from '../types';

interface SummaryViewProps {
  budget: BudgetProject;
  onBack: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ budget, onBack }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveToNetSuite = async () => {
    setSaving(true);
    // Simulación de guardado en NetSuite
    await new Promise(resolve => setTimeout(resolve, 2500));
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">
          ✓
        </div>
        <h2 className="text-4xl font-black text-slate-800">Presupuesto en NetSuite</h2>
        <p className="text-slate-500 text-lg">La estructura jerárquica ha sido creada y vinculada exitosamente a los registros contables correspondientes.</p>
        <div className="pt-8">
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl"
          >
            Nueva Planificación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Validación Estructural</h2>
          <p className="text-slate-500 font-medium">Visualización completa del flujo de capital Top-Down.</p>
        </div>
        <button 
          onClick={onBack} 
          className="text-blue-600 font-bold hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"
        >
          ← Ajustar Montos
        </button>
      </div>

      {/* Tarjetas de Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Subsidiaria</p>
            <p className="font-bold text-slate-800 truncate">{budget.subsidiary === '1' ? 'Global Operations Inc.' : 'Regional Branch'}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Período Fiscal</p>
            <p className="font-bold text-slate-800">{budget.startDate} — {budget.endDate}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
               <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Total a Dispersar</p>
            <p className="font-black text-blue-600 text-2xl">${budget.totalAmount.toLocaleString()}</p>
         </div>
      </div>

      {/* Diagrama de Árbol Jerárquico */}
      <div className="bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden border-4 border-slate-800">
        <div className="bg-white rounded-[2.2rem] p-8 overflow-x-auto min-h-[600px] flex items-center">
          <div className="flex gap-16 min-w-max py-10 relative">
            
            {/* NIVEL 0: SUBSIDIARIA */}
            <div className="flex flex-col justify-center relative">
              <div className="w-56 bg-slate-800 text-white p-6 rounded-3xl shadow-2xl relative z-10 border-2 border-slate-700">
                <p className="text-[10px] font-black opacity-50 uppercase mb-2">Subsidiaria</p>
                <h4 className="font-black text-lg leading-tight mb-2">NetSuite Root</h4>
                <p className="font-mono text-xl text-blue-400">${budget.totalAmount.toLocaleString()}</p>
              </div>
              {/* Conector principal */}
              <div className="absolute left-full top-1/2 w-16 h-0.5 bg-slate-200 -translate-y-1/2" />
            </div>

            {/* NIVEL 1: DEPARTAMENTOS */}
            <div className="flex flex-col justify-center gap-12 relative">
              {/* Línea vertical de conexión para Depts */}
              <div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-slate-100" />
              
              {budget.departments.map((dept, dIdx) => (
                <div key={dept.id} className="flex items-center gap-16 relative">
                  {/* Línea horizontal desde el eje vertical */}
                  <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-slate-100" />
                  
                  <div className="w-64 bg-white border-2 border-slate-100 p-5 rounded-3xl shadow-sm hover:border-blue-300 transition-all group relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Departamento</p>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{dept.name}</h4>
                    <p className="font-mono font-black text-slate-900 mt-2">${dept.amount.toLocaleString()}</p>
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-blue-500 h-full" style={{ width: `${(dept.amount / budget.totalAmount) * 100}%` }} />
                    </div>
                  </div>

                  {/* NIVEL 2: UBICACIONES */}
                  <div className="flex flex-col justify-center gap-6 relative">
                    <div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-slate-50" />
                    
                    {dept.locations.map((loc, lIdx) => (
                      <div key={loc.id} className="flex items-center gap-12 relative">
                        <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-slate-50" />
                        
                        <div className="w-56 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm relative z-10 group-hover:bg-white transition-all">
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">📍 Ubicación</p>
                           <h5 className="font-bold text-slate-700 text-sm">{loc.name}</h5>
                           <p className="font-mono font-bold text-blue-600 text-xs mt-1">${loc.amount.toLocaleString()}</p>
                        </div>

                        {/* NIVEL 3: CUENTAS GL */}
                        <div className="flex flex-col gap-2">
                          {loc.accounts.map(acc => (
                            <div key={acc.id} className="w-48 bg-emerald-50/50 border border-emerald-100 px-3 py-2 rounded-xl flex justify-between items-center group/acc hover:bg-emerald-50 transition-colors">
                               <span className="text-[10px] font-bold text-emerald-800 truncate pr-2">{acc.name}</span>
                               <span className="text-[10px] font-mono font-black text-emerald-600">${acc.amount.toLocaleString()}</span>
                            </div>
                          ))}
                          {loc.accounts.length === 0 && (
                            <span className="text-[10px] text-slate-300 italic px-4">Sin cuentas</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Acción Final */}
      <div className="flex flex-col items-center gap-6 pt-6">
         <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 px-8 py-4 rounded-3xl border-2 border-emerald-100 shadow-sm animate-bounce">
            <span className="text-2xl">⚡</span>
            <span className="font-black text-sm uppercase tracking-tight">Jerarquía validada al 100%</span>
         </div>
         
         <button 
           disabled={saving}
           onClick={handleSaveToNetSuite}
           className="group bg-slate-900 hover:bg-black text-white w-full max-w-xl py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all active:scale-[0.97] relative overflow-hidden"
         >
           {saving ? (
             <span className="flex items-center justify-center gap-4">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="animate-pulse">Sincronizando...</span>
             </span>
           ) : (
             <span className="flex items-center justify-center gap-3">
               Crear Presupuesto en NetSuite
               <span className="group-hover:translate-x-2 transition-transform">→</span>
             </span>
           )}
         </button>
         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Esta acción es irreversible y creará múltiples registros de Budget en el ERP</p>
      </div>
    </div>
  );
};

export default SummaryView;
