import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PiggyBank, Wallet, Check, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { NumericFormat } from 'react-number-format';

export const UserInfo: React.FC = () => {
  const { income, setIncome, budgetItems, savingsGoals } = useBudget();

  const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const leftover = income - totalExpenses;
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  // State for adding income
  const [isAdding, setIsAdding] = useState(false);
  const [additionalIncome, setAdditionalIncome] = useState(0);
  const [incomeHistory, setIncomeHistory] = useState<number[]>([]);
  const [showIncomeHistory, setShowIncomeHistory] = useState(false); // Toggle history visibility

  const handleAddIncome = () => {
    if (additionalIncome > 0) {
      setIncome(income + additionalIncome); // Add new amount to income
      setIncomeHistory([...incomeHistory, additionalIncome]); // Store in history
      setAdditionalIncome(0);
      setIsAdding(false);
    }
  };

  const handleDeleteIncome = (amount: number, index: number) => {
    setIncome(income - amount); // Subtract from total income
    setIncomeHistory(incomeHistory.filter((_, i) => i !== index)); // Remove from history
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddIncome();
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

          {/* Input for adding income */}
          {isAdding ? (
            <div className="flex items-center gap-2">
              <NumericFormat
                value={additionalIncome}
                onValueChange={(values) => setAdditionalIncome(values.floatValue || 0)}
                thousandSeparator={true}
                prefix="$"
                className="input w-full"
                placeholder="Add amount"
                autoFocus
                onKeyDown={handleKeyDown} // Save on Enter
              />
              <button onClick={handleAddIncome} className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 transition">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div
              className="flex justify-between items-center cursor-pointer p-2 rounded hover:bg-gray-800 transition"
              onClick={() => setIsAdding(true)}
            >
              <span className="text-white text-lg">${income.toLocaleString()}</span>
              <Plus size={18} className="text-primary" />
            </div>
          )}

          {/* Toggle button to show/hide income history */}
          {incomeHistory.length > 0 && (
            <button
              onClick={() => setShowIncomeHistory(!showIncomeHistory)}
              className="mt-0 flex justify-center items-center w-full"
            >
              <motion.div
                animate={{ rotate: showIncomeHistory ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center items-center"
              >
                <ChevronDown size={20} className="text-gray-400 hover:text-white" />
              </motion.div>
            </button>
          )}

          {/* Income History List (only visible when toggled) */}
          {showIncomeHistory && incomeHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="bg-neutral-700 p-3 mt-3 rounded-lg max-h-32 overflow-y-auto border border-gray-700"
            >
              <ul className="space-y-1">
                {incomeHistory.map((amount, index) => (
                  <li key={index} className="flex justify-between items-center bg-dark p-2 rounded-md border border-gray-800">
                    <span className="text-gray-300">+${amount.toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteIncome(amount, index)}
                      className="text-red-500 hover:text-gray-300 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Total Expenses Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-primary" />
            <span className="text-gray-400">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
        </div>

        {/* Leftover Money Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-primary" />
            <span className="text-gray-400">Leftover</span>
          </div>
          <div className={`text-2xl font-bold ${leftover >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(leftover).toLocaleString()}
          </div>
        </div>

        {/* Total Savings Section */}
        <div className="p-4 bg-dark rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <PiggyBank className="text-primary" />
            <span className="text-gray-400">Total Savings</span>
          </div>
          <div className="text-2xl font-bold text-primary">${totalSavings.toLocaleString()}</div>
        </div>
      </div>
    </motion.div>
  );
};