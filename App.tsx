
import React, { useState, useEffect, useMemo } from 'react';
import { BudgetLevel, BudgetProject, GLAccount, LocationBudget, DepartmentBudget } from './types';
import { MOCK_SUBSIDIARIES, MOCK_DEPARTMENTS, MOCK_LOCATIONS, MOCK_ACCOUNTS, STEPS } from './constants';
import BudgetSetup from './components/BudgetSetup';
import DepartmentLevel from './components/DepartmentLevel';
import LocationLevel from './components/LocationLevel';
import GLAccountLevel from './components/GLAccountLevel';
import SummaryView from './components/SummaryView';

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<BudgetLevel>(BudgetLevel.SETUP);
  const [budget, setBudget] = useState<BudgetProject>({
    id: '',
    subsidiary: '',
    startDate: '',
    endDate: '',
    totalAmount: 0,
    departments: [],
    status: 'Draft'
  });

  const [activeDeptId, setActiveDeptId] = useState<string | null>(null);
  const [activeLocId, setActiveLocId] = useState<string | null>(null);

  // Initialize departments when setup is done
  const handleSetupComplete = (setup: Partial<BudgetProject>) => {
    setBudget(prev => ({
      ...prev,
      ...setup,
      departments: MOCK_DEPARTMENTS.map(d => ({
        id: d.id,
        name: d.name,
        amount: 0,
        locations: MOCK_LOCATIONS.map(l => ({
          id: l.id,
          name: l.name,
          amount: 0,
          accounts: []
        }))
      }))
    }));
    setCurrentLevel(BudgetLevel.DEPARTMENTS);
  };

  const updateDepartmentAmount = (deptId: string, amount: number) => {
    setBudget(prev => ({
      ...prev,
      departments: prev.departments.map(d => 
        d.id === deptId ? { ...d, amount } : d
      )
    }));
  };

  const updateLocationAmount = (deptId: string, locId: string, amount: number) => {
    setBudget(prev => ({
      ...prev,
      departments: prev.departments.map(d => 
        d.id === deptId ? {
          ...d,
          locations: d.locations.map(l => 
            l.id === locId ? { ...l, amount } : l
          )
        } : d
      )
    }));
  };

  const updateGLAccounts = (deptId: string, locId: string, accounts: GLAccount[]) => {
    setBudget(prev => ({
      ...prev,
      departments: prev.departments.map(d => 
        d.id === deptId ? {
          ...d,
          locations: d.locations.map(l => 
            l.id === locId ? { ...l, accounts } : l
          )
        } : d
      )
    }));
  };

  const allocatedTotal = useMemo(() => 
    budget.departments.reduce((acc, d) => acc + d.amount, 0),
    [budget.departments]
  );

  const isLevel1Valid = allocatedTotal === budget.totalAmount && budget.totalAmount > 0;

  const renderLevel = () => {
    switch (currentLevel) {
      case BudgetLevel.SETUP:
        return <BudgetSetup onComplete={handleSetupComplete} />;
      case BudgetLevel.DEPARTMENTS:
        return (
          <DepartmentLevel 
            budget={budget} 
            onUpdateAmount={updateDepartmentAmount} 
            onNext={() => setCurrentLevel(BudgetLevel.LOCATIONS)} 
          />
        );
      case BudgetLevel.LOCATIONS:
        return (
          <LocationLevel 
            budget={budget} 
            onUpdateAmount={updateLocationAmount}
            onPrev={() => setCurrentLevel(BudgetLevel.DEPARTMENTS)}
            onNext={() => setCurrentLevel(BudgetLevel.ACCOUNTS)}
            activeDeptId={activeDeptId}
            setActiveDeptId={setActiveDeptId}
          />
        );
      case BudgetLevel.ACCOUNTS:
        return (
          <GLAccountLevel 
            budget={budget}
            onUpdateAccounts={updateGLAccounts}
            onPrev={() => setCurrentLevel(BudgetLevel.LOCATIONS)}
            onNext={() => setCurrentLevel(BudgetLevel.SUMMARY)}
            activeDeptId={activeDeptId}
            setActiveDeptId={setActiveDeptId}
            activeLocId={activeLocId}
            setActiveLocId={setActiveLocId}
          />
        );
      case BudgetLevel.SUMMARY:
        return (
          <SummaryView 
            budget={budget} 
            onBack={() => setCurrentLevel(BudgetLevel.ACCOUNTS)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl leading-none">NB</div>
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">NetSuite Budget Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">V 2.0.4</span>
          {budget.totalAmount > 0 && (
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
               <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Budget</p>
                  <p className="text-sm font-bold text-blue-600">${budget.totalAmount.toLocaleString()}</p>
               </div>
            </div>
          )}
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 px-6 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 min-w-max mx-auto max-w-6xl">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
                currentLevel === step.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className="text-sm font-semibold">{step.title}</span>
            </div>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          {renderLevel()}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-4 text-center text-slate-400 text-xs">
        &copy; 2025 Hierarchical Budgeting for NetSuite. All components strict validation enabled.
      </footer>
    </div>
  );
};

export default App;
