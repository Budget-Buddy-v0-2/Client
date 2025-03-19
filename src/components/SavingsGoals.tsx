import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { NumericFormat } from 'react-number-format';

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useBudget();
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0 });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      addSavingsGoal(newGoal);
      setNewGoal({ name: '', targetAmount: 0 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary">Savings Goals</h2>

      {savingsGoals.length < 4 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newGoal.name}
            onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Goal name"
            className="input"
          />
          <div className="flex gap-2">
            <NumericFormat
              value={newGoal.targetAmount}
              onValueChange={(values) => setNewGoal(prev => ({ ...prev, targetAmount: values.floatValue || 0 }))}
              thousandSeparator={true}
              prefix="$"
              className="input flex-1"
              placeholder="Target amount"
            />
            <button
              onClick={handleAddGoal}
              className="btn-primary"
              disabled={savingsGoals.length >= 4}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isComplete = progress >= 100;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-lg ${isComplete ? 'bg-primary bg-opacity-20' : 'bg-dark'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-gray-400">
                      ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const amount = window.prompt('Enter new amount:', goal.currentAmount.toString());
                        if (amount !== null) {
                          updateSavingsGoal(goal.id, { currentAmount: parseFloat(amount) || 0 });
                        }
                      }}
                      className="btn-secondary p-2"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteSavingsGoal(goal.id)}
                      className="btn-secondary p-2 text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="h-2 bg-dark-light rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      isComplete ? 'bg-primary animate-pulse' : 'bg-primary'
                    }`}
                  />
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  {progress.toFixed(1)}%
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {savingsGoals.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No savings goals yet. Add up to 4 goals to track your progress.
        </div>
      )}
    </motion.div>
  );
};