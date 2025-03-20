export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  color?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Category {
  name: string;
  totalAmount: number;
  percentage: number;
}
