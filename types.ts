
export interface GLAccount {
  id: string;
  name: string;
  amount: number;
}

export interface LocationBudget {
  id: string;
  name: string;
  amount: number;
  accounts: GLAccount[];
}

export interface DepartmentBudget {
  id: string;
  name: string;
  amount: number;
  locations: LocationBudget[];
}

export interface BudgetProject {
  id: string;
  subsidiary: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  departments: DepartmentBudget[];
  status: 'Draft' | 'Finalized';
}

export interface NetSuiteEntity {
  id: string;
  name: string;
}

export enum BudgetLevel {
  SETUP = 0,
  DEPARTMENTS = 1,
  LOCATIONS = 2,
  ACCOUNTS = 3,
  SUMMARY = 4
}
