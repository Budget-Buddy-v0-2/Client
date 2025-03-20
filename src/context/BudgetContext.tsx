import React, { createContext, useContext, useState, useCallback } from 'react';
import { BudgetItem, SavingsGoal } from '../types';

interface BudgetContextType {
  income: number;
  setIncome: (income: number) => void;
  budgetItems: BudgetItem[];
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, item: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  savingsGoals: SavingsGoal[];
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState(0);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  const addBudgetItem = useCallback((item: Omit<BudgetItem, 'id'>) => {
    setBudgetItems(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  }, []);

  const updateBudgetItem = useCallback((id: string, item: Partial<BudgetItem>) => {
    setBudgetItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  }, []);

  const deleteBudgetItem = useCallback((id: string) => {
    setBudgetItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    setSavingsGoals(prev => {
      if (prev.length >= 4) return prev;
      return [...prev, { ...goal, id: crypto.randomUUID(), currentAmount: 0 }];
    });
  }, []);

  const updateSavingsGoal = useCallback((id: string, goal: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  return (
    <BudgetContext.Provider value={{
      income,
      setIncome,
      budgetItems,
      addBudgetItem,
      updateBudgetItem,
      deleteBudgetItem,
      savingsGoals,
      addSavingsGoal,
      setSavingsGoals,
      updateSavingsGoal,
      deleteSavingsGoal,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};