
import React, { useState } from 'react';
import { MOCK_SUBSIDIARIES } from '../constants';

interface BudgetSetupProps {
  onComplete: (setup: { subsidiary: string; startDate: string; endDate: string; totalAmount: number }) => void;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    subsidiary: '',
    startDate: '',
    endDate: '',
    totalAmount: 0
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subsidiary || !formData.startDate || !formData.endDate || formData.totalAmount <= 0) {
      setError("Please fill in all fields correctly.");
      return;
    }
    
    // Simulate NetSuite validation for existing budget
    if (formData.subsidiary === "2" && formData.startDate.startsWith('2024')) {
      setError("A budget already exists for this subsidiary and period.");
      return;
    }

    onComplete(formData);
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">New Budget Plan</h2>
          <p className="text-blue-100 opacity-90">Define the global constraints for your NetSuite financial period.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm flex items-center gap-3">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Subsidiary</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.subsidiary}
              onChange={e => setFormData({ ...formData, subsidiary: e.target.value })}
            >
              <option value="">Select Subsidiary...</option>
              {MOCK_SUBSIDIARIES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Start Date</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">End Date</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Total Budget Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number"
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold text-lg"
                value={formData.totalAmount || ''}
                onChange={e => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
          >
            Initialize Budget Flow
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetup;
