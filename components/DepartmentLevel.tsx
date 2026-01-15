
import React from 'react';
import { BudgetProject } from '../types';

interface DepartmentLevelProps {
  budget: BudgetProject;
  onUpdateAmount: (deptId: string, amount: number) => void;
  onNext: () => void;
}

const DepartmentLevel: React.FC<DepartmentLevelProps> = ({ budget, onUpdateAmount, onNext }) => {
  const currentSum = budget.departments.reduce((sum, d) => sum + d.amount, 0);
  const remaining = budget.totalAmount - currentSum;
  const isComplete = Math.abs(remaining) < 0.01;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">Department Allocation (N1)</h2>
          <p className="text-slate-500">Distribute the total subsidiary budget across active departments.</p>
        </div>
        <div className="flex gap-4">
          <div className={`p-4 rounded-xl border-2 transition-all ${isComplete ? 'border-emerald-200 bg-emerald-50' : 'border-blue-100 bg-blue-50'}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400">Current Total</p>
            <p className={`text-xl font-bold ${isComplete ? 'text-emerald-600' : 'text-blue-600'}`}>${currentSum.toLocaleString()}</p>
          </div>
          <div className={`p-4 rounded-xl border-2 transition-all ${remaining === 0 ? 'border-emerald-200 bg-emerald-50' : remaining > 0 ? 'border-amber-100 bg-amber-50' : 'border-red-100 bg-red-50'}`}>
            <p className="text-[10px] uppercase font-bold text-slate-400">Balance Remaining</p>
            <p className={`text-xl font-bold ${remaining === 0 ? 'text-emerald-600' : remaining > 0 ? 'text-amber-600' : 'text-red-600'}`}>
               ${remaining.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {budget.departments.map(dept => (
          <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-400">
                {dept.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{dept.name}</h3>
                <p className="text-xs text-slate-400">Department ID: {dept.id}</p>
              </div>
            </div>
            <div className="w-64">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold"
                  value={dept.amount || ''}
                  onChange={e => onUpdateAmount(dept.id, parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${Math.min(100, (dept.amount / budget.totalAmount) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`px-12 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center gap-3 ${
            isComplete 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isComplete ? 'Continue to Locations' : 'Sum Must Match Total'}
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default DepartmentLevel;
