import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PiggyBank, Wallet, Check, Plus } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { NumericFormat } from 'react-number-format';
import { SavingsGoal } from '../types';

export const UserInfo: React.FC = () => {
  const { income, setIncome, budgetItems, savingsGoals, setSavingsGoals } = useBudget();
  const [totalSavingsAmount, setTotalSavingsAmount] = useState(0);

  const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const leftover = income - totalExpenses;
  const totalSavings = totalSavingsAmount + savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  // State for adding income
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [additionalIncome, setAdditionalIncome] = useState(0);
  const [incomeHistory, setIncomeHistory] = useState<number[]>([]);

  // State for adding savings
  const [isAddingSavings, setIsAddingSavings] = useState(false);
  const [additionalSavings, setAdditionalSavings] = useState(0);
  const [savingsHistory, setSavingsHistory] = useState<number[]>([]);

  // Ensure Enter key submits income
  const handleKeyDownIncome = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddIncome();
    }
  };

  const handleKeyDownSavings = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddSavings();
    }
  };

  const handleAddIncome = () => {
    if (additionalIncome > 0) {
      setIncome(income + additionalIncome);
      setIncomeHistory([...incomeHistory, additionalIncome]);
      setAdditionalIncome(0);
      setIsAddingIncome(false);
    }
  };

  const handleAddSavings = () => {
    if (additionalSavings > 0) {
      if (savingsGoals.length > 0) {
        // ✅ If goals exist, update them
        const updatedGoals = savingsGoals.map((goal) => ({
          ...goal,
          currentAmount: goal.currentAmount + additionalSavings,
        }));
        setSavingsGoals(updatedGoals);
      }
      // ✅ If no goals exist, just add to total savings
      setTotalSavingsAmount((prev) => prev + additionalSavings);

      // ✅ Track savings history
      setSavingsHistory((prevHistory) => [...prevHistory, additionalSavings]);

      setAdditionalSavings(0);
      setIsAddingSavings(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Financial Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Monthly Income Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-primary" />
            <span className="text-gray-400">Monthly Income</span>
          </div>
          {isAddingIncome ? (
            <div className="flex items-center gap-2">
              <NumericFormat
                value={additionalIncome}
                onValueChange={(values) => setAdditionalIncome(values.floatValue || 0)}
                thousandSeparator={true}
                prefix="$"
                className="input w-full"
                placeholder="Add amount"
                autoFocus
                onKeyDown={handleKeyDownIncome} // ✅ Ensure Enter key submits income
              />
              <button onClick={handleAddIncome} className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 transition">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-2 rounded hover:bg-gray-800 transition" onClick={() => setIsAddingIncome(true)}>
              <span className="text-white text-lg">
                ${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Plus size={18} className="text-primary" />
            </div>
          )}
        </div>

        {/* Total Expenses Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-primary" />
            <span className="text-gray-400">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold">
            ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Leftover Money Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-primary" />
            <span className="text-gray-400">Leftover</span>
          </div>
          <div className={`text-2xl font-bold ${leftover >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(leftover).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Savings Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <PiggyBank className="text-primary" />
            <span className="text-gray-400">Total Savings</span>
          </div>

          {isAddingSavings ? (
            <div className="flex items-center gap-2">
              <NumericFormat
                value={additionalSavings}
                onValueChange={(values) => setAdditionalSavings(values.floatValue || 0)}
                thousandSeparator={true}
                prefix="$"
                className="input w-full"
                placeholder="Add amount"
                autoFocus
                onKeyDown={handleKeyDownSavings} // ✅ Ensure Enter key submits savings
              />
              <button onClick={handleAddSavings} className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 transition">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center cursor-pointer p-2 rounded hover:bg-gray-800 transition" onClick={() => setIsAddingSavings(true)}>
              <span className="text-white text-lg">
                ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Plus size={18} className="text-primary" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};