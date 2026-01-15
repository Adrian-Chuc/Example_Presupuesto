
import React, { useState } from 'react';
import { BudgetProject, GLAccount, LocationBudget } from '../types';
import { MOCK_ACCOUNTS } from '../constants';

interface GLAccountLevelProps {
  budget: BudgetProject;
  onUpdateAccounts: (deptId: string, locId: string, accounts: GLAccount[]) => void;
  onPrev: () => void;
  onNext: () => void;
  activeDeptId: string | null;
  setActiveDeptId: (id: string) => void;
  activeLocId: string | null;
  setActiveLocId: (id: string) => void;
}

const GLAccountLevel: React.FC<GLAccountLevelProps> = ({
  budget,
  onUpdateAccounts,
  onPrev,
  onNext,
  activeDeptId,
  setActiveDeptId,
  activeLocId,
  setActiveLocId
}) => {
  const [selectedAccToAdd, setSelectedAccToAdd] = useState('');
  
  const currentDeptId = activeDeptId || budget.departments[0]?.id;
  const currentDept = budget.departments.find(d => d.id === currentDeptId);
  const currentLocId = activeLocId || currentDept?.locations[0]?.id;
  const currentLoc = currentDept?.locations.find(l => l.id === currentLocId);

  const getLocRemaining = (loc: LocationBudget) => {
    const sum = loc.accounts.reduce((acc, a) => acc + a.amount, 0);
    return loc.amount - sum;
  };

  const isLocValid = (loc: LocationBudget) => Math.abs(getLocRemaining(loc)) < 0.01;
  
  const allValid = budget.departments.every(d => 
    d.locations.every(l => isLocValid(l))
  );

  const availableAccounts = MOCK_ACCOUNTS.filter(
    ma => !currentLoc?.accounts.some(a => a.id === ma.id)
  );

  const handleAddSelectedAccount = (id: string) => {
    if (!id || !currentLoc) return;
    const accountTemplate = MOCK_ACCOUNTS.find(a => a.id === id);
    if (!accountTemplate) return;
    
    const newAcc: GLAccount = { 
      id: accountTemplate.id, 
      name: accountTemplate.name, 
      amount: 0 
    };
    
    onUpdateAccounts(currentDeptId!, currentLocId!, [...currentLoc.accounts, newAcc]);
    setSelectedAccToAdd(''); // Reset select after adding
  };

  const updateAccAmount = (accId: string, amount: number) => {
    if (!currentLoc) return;
    const newAccounts = currentLoc.accounts.map(a => a.id === accId ? { ...a, amount } : a);
    onUpdateAccounts(currentDeptId!, currentLocId!, newAccounts);
  };

  const removeAccount = (accId: string) => {
    if (!currentLoc) return;
    const newAccounts = currentLoc.accounts.filter(a => a.id !== accId);
    onUpdateAccounts(currentDeptId!, currentLocId!, newAccounts);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-right duration-500">
      <aside className="lg:w-80 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest px-2">Navigator</h3>
          <div className="space-y-4">
            {budget.departments.map(dept => (
              <div key={dept.id} className="space-y-1">
                <button 
                  onClick={() => setActiveDeptId(dept.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-colors ${currentDeptId === dept.id ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  🏢 {dept.name}
                </button>
                {currentDeptId === dept.id && (
                  <div className="pl-4 space-y-1">
                    {dept.locations.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => setActiveLocId(loc.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                          currentLocId === loc.id 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate pr-2">{loc.name}</span>
                        {isLocValid(loc) ? <span className="text-[10px]">✅</span> : <span className="opacity-30">•</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <button onClick={onPrev} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2 px-2 transition-colors">
             <span>←</span> Back to N2
          </button>
          <button 
            disabled={!allValid}
            onClick={onNext}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${
              allValid 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Review Full Summary
          </button>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        {currentLoc && (
          <>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden relative gap-4">
               <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
               <div>
                  <h2 className="text-3xl font-black text-slate-800">GL Accounts (N3)</h2>
                  <p className="text-slate-500">Assigning lines for <strong className="text-slate-700">{currentLoc.name}</strong></p>
               </div>
               <div className="text-right bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Target for Location</p>
                  <p className="text-2xl font-black text-slate-800">${currentLoc.amount.toLocaleString()}</p>
                  <p className={`text-sm font-bold ${getLocRemaining(currentLoc) === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    ${getLocRemaining(currentLoc).toLocaleString()} remaining
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active GL Lines</span>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select 
                      className="flex-1 sm:w-64 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                      value={selectedAccToAdd}
                      onChange={(e) => handleAddSelectedAccount(e.target.value)}
                    >
                      <option value="">+ Select GL Account to add...</option>
                      {availableAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                      {availableAccounts.length === 0 && (
                        <option disabled>No more accounts available</option>
                      )}
                    </select>
                    <div className="text-slate-300 pointer-events-none -ml-8 mr-4">▼</div>
                  </div>
               </div>
               
               <div className="divide-y divide-slate-50">
                  {currentLoc.accounts.length === 0 ? (
                    <div className="p-16 text-center space-y-3">
                       <div className="text-4xl">🧾</div>
                       <p className="text-slate-400 italic font-medium">No accounts assigned to this location yet.</p>
                       <p className="text-xs text-slate-300">Use the dropdown above to start adding GL lines.</p>
                    </div>
                  ) : (
                    currentLoc.accounts.map(acc => (
                      <div key={acc.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/80 transition-all">
                        <div className="flex-1">
                           <p className="font-bold text-slate-800">{acc.name}</p>
                           <p className="text-[10px] text-slate-400 font-mono">NS-ID: {acc.id}</p>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="relative w-40">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                              <input 
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm font-bold transition-all"
                                value={acc.amount || ''}
                                onChange={e => updateAccAmount(acc.id, parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                           </div>
                           <button 
                             onClick={() => removeAccount(acc.id)}
                             className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                             title="Remove line"
                           >
                             ✕
                           </button>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>

            {isLocValid(currentLoc) && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-5 text-emerald-800 animate-in fade-in zoom-in duration-500">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-100">
                  ✓
                </div>
                <div>
                   <p className="font-black text-lg">Location Balanced</p>
                   <p className="text-sm opacity-80">All funds for <strong>{currentLoc.name}</strong> have been correctly distributed among GL accounts.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GLAccountLevel;
