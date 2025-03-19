import React from 'react';
import { motion } from 'framer-motion';
import { BudgetProvider } from './context/BudgetContext';
import { UserInfo } from './components/UserInfo';
import { BudgetTable } from './components/BudgetTable';
import { CategoriesBreakdown } from './components/CategoriesBreakdown';
import { SavingsGoals } from './components/SavingsGoals';

function App() {
  return (
    <BudgetProvider>
      <div className="min-h-screen bg-dark p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Budget Buddy</h1>
            <p className="text-gray-400">Manage your finances with ease</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <UserInfo />
              <BudgetTable />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <CategoriesBreakdown />
              <SavingsGoals />
            </div>
          </div>
        </motion.div>
      </div>
    </BudgetProvider>
  );
}

export default App;