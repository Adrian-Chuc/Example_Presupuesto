
import React from 'react';
import { BudgetProject, DepartmentBudget } from '../types';

interface LocationLevelProps {
  budget: BudgetProject;
  onUpdateAmount: (deptId: string, locId: string, amount: number) => void;
  onPrev: () => void;
  onNext: () => void;
  activeDeptId: string | null;
  setActiveDeptId: (id: string) => void;
}

const LocationLevel: React.FC<LocationLevelProps> = ({ 
  budget, 
  onUpdateAmount, 
  onPrev, 
  onNext, 
  activeDeptId, 
  setActiveDeptId 
}) => {
  const currentActiveDeptId = activeDeptId || budget.departments[0]?.id;
  const activeDept = budget.departments.find(d => d.id === currentActiveDeptId);

  const getDeptRemaining = (dept: DepartmentBudget) => {
    const sum = dept.locations.reduce((acc, l) => acc + l.amount, 0);
    return dept.amount - sum;
  };

  const isDeptValid = (dept: DepartmentBudget) => {
    return Math.abs(getDeptRemaining(dept)) < 0.01;
  };

  const allDeptsValid = budget.departments.every(isDeptValid);

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-right duration-500">
      {/* Sidebar: Dept Selectors */}
      <aside className="lg:w-80 space-y-4">
        <h3 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest px-2">Departments</h3>
        <div className="space-y-2">
          {budget.departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => setActiveDeptId(dept.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                currentActiveDeptId === dept.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold">{dept.name}</span>
                <span className={`text-[10px] font-medium ${currentActiveDeptId === dept.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  ${dept.amount.toLocaleString()} Allocated
                </span>
              </div>
              {isDeptValid(dept) ? (
                <span className="text-lg">✅</span>
              ) : (
                <div className={`w-3 h-3 rounded-full ${currentActiveDeptId === dept.id ? 'bg-white animate-pulse' : 'bg-amber-400'}`} />
              )}
            </button>
          ))}
        </div>

        <div className="pt-8 flex flex-col gap-3">
          <button onClick={onPrev} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2 px-2">
             <span>←</span> Back to N1
          </button>
          <button 
            disabled={!allDeptsValid}
            onClick={onNext}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${
              allDeptsValid 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Go to GL Accounts
          </button>
        </div>
      </aside>

      {/* Main Content: Location Distribution */}
      <div className="flex-1 space-y-6">
        {activeDept && (
          <>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
               <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-black text-slate-800">Location Level (N2)</h2>
                    <p className="text-slate-500 mt-1">Distributing <strong>${activeDept.amount.toLocaleString()}</strong> for {activeDept.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Balance for Dept</p>
                    <p className={`text-2xl font-black ${getDeptRemaining(activeDept) === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      ${getDeptRemaining(activeDept).toLocaleString()}
                    </p>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDept.locations.map(loc => (
                <div key={loc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 hover:border-blue-400 transition-colors group">
                   <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{loc.name}</span>
                      <span className="text-[10px] font-bold text-slate-300">ID: {loc.id}</span>
                   </div>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input 
                        type="number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold text-lg"
                        value={loc.amount || ''}
                        onChange={e => onUpdateAmount(activeDept.id, loc.id, parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                   </div>
                </div>
              ))}
            </div>
            
            {getDeptRemaining(activeDept) !== 0 && (
               <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 text-amber-700">
                  <span className="text-2xl">💡</span>
                  <p className="text-sm font-medium">Ensure the total sum of these locations matches exactly <strong>${activeDept.amount.toLocaleString()}</strong> to validate this department.</p>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationLevel;
