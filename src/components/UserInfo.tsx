import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PiggyBank, Wallet, Check, Plus } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { NumericFormat } from 'react-number-format';
// import { SavingsGoal } from '../types';

export const UserInfo: React.FC = () => {
  const { income, setIncome, budgetItems, savingsGoals, setSavingsGoals } = useBudget();
  const [totalSavingsAmount, setTotalSavingsAmount] = useState(0);

  const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const leftover = income - totalExpenses;
  const totalSavings = totalSavingsAmount + savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [additionalIncome, setAdditionalIncome] = useState(0);
  const [incomeHistory, setIncomeHistory] = useState<number[]>([]);

  const [isViewingIncomeHistory, setIsViewingIncomeHistory] = useState(false);

  const [isAddingSavings, setIsAddingSavings] = useState(false);
  const [additionalSavings, setAdditionalSavings] = useState(0);
  const [savingsHistory, setSavingsHistory] = useState<number[]>([]);

  // 🔹 Refs for detecting clicks outside the input fields
  const incomeRef = useRef<HTMLDivElement>(null);
  const savingsRef = useRef<HTMLDivElement>(null);

  // 🔹 Effect to handle clicks outside the input fields
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (incomeRef.current && !incomeRef.current.contains(event.target as Node)) {
        setIsAddingIncome(false);
        setAdditionalIncome(0);
      }
      if (savingsRef.current && !savingsRef.current.contains(event.target as Node)) {
        setIsAddingSavings(false);
        setAdditionalSavings(0);
      }
    };

    // 🔹 Event listener to handle clicks outside the input fieldss
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔹 Function to handle Enter key for adding income
  const handleKeyDownIncome = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddIncome();
    }
  };

  // 🔹 Function to handle Enter key for adding savings
  const handleKeyDownSavings = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddSavings();
    }
  };

  // 🔹 Function to handle adding income
  const handleAddIncome = () => {
    if (additionalIncome > 0) {
      setIncome(income + additionalIncome);
      setIncomeHistory([...incomeHistory, additionalIncome]);
      setAdditionalIncome(0);
      setIsAddingIncome(false);
    }
  };

  // 🔹 Function to handle adding savings
  const handleAddSavings = () => {
    if (additionalSavings > 0) {
      if (savingsGoals.length > 0) {
        const updatedGoals = savingsGoals.map((goal) => ({
          ...goal,
          currentAmount: goal.currentAmount + additionalSavings,
        }));
        setSavingsGoals(updatedGoals);
      }
      setTotalSavingsAmount((prev) => prev + additionalSavings);
      setSavingsHistory((prevHistory) => [...prevHistory, additionalSavings]);
      setAdditionalSavings(0);
      setIsAddingSavings(false);
    }
  };

  // 🔹 Your original handleDeleteIncome function—untouched
  const handleDeleteIncome = (index: number) => {
    setIncomeHistory((prevHistory) => {
      const deletedAmount: number = prevHistory[index];
      const updatedHistory = prevHistory.filter((_, i) => i !== index);
      setIncome(income - deletedAmount);
      setIsAddingIncome(false);
      return updatedHistory;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Financial Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Monthly Income Section */}
        <div className="p-4 bg-dark rounded-lg relative" ref={incomeRef}>
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
                onKeyDown={handleKeyDownIncome}
              />
              <button
                onClick={handleAddIncome}
                className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 transition"
              >
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div
              className="flex justify-between items-center cursor-pointer p-2 rounded hover:bg-gray-800 transition"
              onClick={() => setIsAddingIncome(true)}
            >
              <span className="text-white text-lg">
                ${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Plus size={18} className="text-primary" />
            </div>
          )}

          {/* Dropdown Button for Income History */}
          {incomeHistory.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsViewingIncomeHistory((prev) => !prev)} // Toggle only income history
                className="text-primary underline text-sm"
              >
                {isViewingIncomeHistory ? "Hide Income History" : "View Income History"}
              </button>
            </div>
          )}

          {/* Income History Dropdown */}
          {isViewingIncomeHistory && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-dark p-3 rounded-lg shadow-lg mt-2 max-h-40 overflow-auto"
            >
              <ul className="space-y-2">
                {incomeHistory.map((entry, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded-lg">
                    <span className="text-white">${entry.toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteIncome(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✖
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
        <div className="p-4 bg-dark rounded-lg" ref={savingsRef}>
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
                onKeyDown={handleKeyDownSavings}
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
    </motion.div >
  );
};