
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

  const handleAddAccount = () => {
    if (!currentLoc) return;
    const available = MOCK_ACCOUNTS.filter(ma => !currentLoc.accounts.some(a => a.id === ma.id));
    if (available.length === 0) return;
    
    const newAcc: GLAccount = { id: available[0].id, name: available[0].name, amount: 0 };
    onUpdateAccounts(currentDeptId!, currentLocId!, [...currentLoc.accounts, newAcc]);
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
                  className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm ${currentDeptId === dept.id ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
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
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span>{loc.name}</span>
                        {isLocValid(loc) ? <span className="ml-1">✓</span> : <span className="ml-1 opacity-50">•</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <button onClick={onPrev} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2 px-2">
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
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center overflow-hidden relative">
               <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
               <div>
                  <h2 className="text-3xl font-black text-slate-800">GL Accounts (N3)</h2>
                  <p className="text-slate-500">Assign GL lines for <strong>{currentLoc.name}</strong> ({currentDept?.name})</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Target for Location</p>
                  <p className="text-2xl font-black text-slate-800">${currentLoc.amount.toLocaleString()}</p>
                  <p className={`text-sm font-bold ${getLocRemaining(currentLoc) === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    ${getLocRemaining(currentLoc).toLocaleString()} left
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active GL Lines</span>
                  <button 
                    onClick={handleAddAccount}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all"
                  >
                    + Add GL Account
                  </button>
               </div>
               
               <div className="divide-y divide-slate-50">
                  {currentLoc.accounts.length === 0 ? (
                    <div className="p-12 text-center">
                       <p className="text-slate-400 italic">No accounts assigned to this location yet.</p>
                       <button onClick={handleAddAccount} className="mt-4 text-blue-600 font-bold hover:underline">Select your first GL account</button>
                    </div>
                  ) : (
                    currentLoc.accounts.map(acc => (
                      <div key={acc.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/80 transition-all">
                        <div className="flex-1">
                           <p className="font-bold text-slate-800">{acc.name}</p>
                           <p className="text-[10px] text-slate-400">NetSuite Internal ID: {acc.id}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="relative w-48">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                              <input 
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm font-bold"
                                value={acc.amount || ''}
                                onChange={e => updateAccAmount(acc.id, parseFloat(e.target.value) || 0)}
                              />
                           </div>
                           <button 
                             onClick={() => removeAccount(acc.id)}
                             className="text-slate-300 hover:text-red-500 transition-colors p-2"
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
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-4 text-emerald-800 animate-in fade-in zoom-in duration-300">
                <span className="text-3xl">🎉</span>
                <div>
                   <p className="font-bold">Perfect Balance!</p>
                   <p className="text-sm">Location {currentLoc.name} is fully allocated and ready for NetSuite sync.</p>
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
