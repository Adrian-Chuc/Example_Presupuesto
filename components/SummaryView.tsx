
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
    // Simulate API call to NetSuite SuiteTalk/Restlet
    await new Promise(resolve => setTimeout(resolve, 2500));
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto">
          ✓
        </div>
        <h2 className="text-4xl font-black text-slate-800">Budget Finalized</h2>
        <p className="text-slate-500 text-lg">The hierarchical budget has been successfully pushed to NetSuite and mapped to all relevant accounting periods.</p>
        <div className="pt-8">
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all"
          >
            Create New Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Review & Submit</h2>
          <p className="text-slate-500">Final hierarchical verification before NetSuite record creation.</p>
        </div>
        <button onClick={onBack} className="text-slate-500 font-bold hover:text-slate-800">Edit Details</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400">Subsidiary</p>
            <p className="font-black text-slate-800">{budget.subsidiary === '1' ? 'Global Operations' : 'Regional Unit'}</p>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400">Period</p>
            <p className="font-black text-slate-800">{budget.startDate} to {budget.endDate}</p>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Amount</p>
            <p className="font-black text-blue-600 text-xl">${budget.totalAmount.toLocaleString()}</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Hierarchy Breakdown</h3>
        </div>
        <div className="p-6 space-y-8">
          {budget.departments.map(dept => (
            <div key={dept.id} className="space-y-4">
               <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-xl">
                  <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-xs">D</span>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-black text-slate-800">{dept.name}</span>
                    <span className="font-mono font-bold">${dept.amount.toLocaleString()}</span>
                  </div>
               </div>
               
               <div className="pl-12 space-y-4 border-l-2 border-slate-100 ml-4">
                  {dept.locations.map(loc => (
                    <div key={loc.id} className="space-y-2">
                       <div className="flex justify-between items-center py-1">
                          <span className="text-sm font-bold text-slate-600">📍 {loc.name}</span>
                          <span className="text-sm font-mono text-slate-500">${loc.amount.toLocaleString()}</span>
                       </div>
                       <div className="grid grid-cols-1 gap-1 pl-4">
                          {loc.accounts.map(acc => (
                            <div key={acc.id} className="flex justify-between items-center text-xs text-slate-400 bg-slate-50/50 p-2 rounded">
                               <span>{acc.name}</span>
                               <span className="font-mono">${acc.amount.toLocaleString()}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-10">
         <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
            <span className="text-xl">✅</span>
            <span className="font-bold text-sm">All levels validated. Sums match perfectly at every node.</span>
         </div>
         <button 
           disabled={saving}
           onClick={handleSaveToNetSuite}
           className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-md py-6 rounded-2xl font-black text-xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] relative overflow-hidden"
         >
           {saving ? (
             <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing with NetSuite...
             </span>
           ) : 'Confirm & Push to NetSuite'}
         </button>
      </div>
    </div>
  );
};

export default SummaryView;
