import React from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { Category } from '../types';

export const CategoriesBreakdown: React.FC = () => {
  const { budgetItems } = useBudget();
  
  const categories = budgetItems.reduce<Category[]>((acc, item) => {
    const existingCategory = acc.find(cat => cat.name === item.category);
    if (existingCategory) {
      existingCategory.totalAmount += item.amount;
    } else {
      acc.push({ name: item.category, totalAmount: item.amount, percentage: 0 });
    }
    return acc;
  }, []);

  const totalExpenses = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  
  categories.forEach(category => {
    category.percentage = (category.totalAmount / totalExpenses) * 100;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary">Categories Breakdown</h2>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">{category.name}</span>
              <span className="text-primary">${category.totalAmount.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-dark-light rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              {category.percentage.toFixed(1)}%
            </div>
          </motion.div>
        ))}

        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No categories yet. Add some budget items to see the breakdown.
          </div>
        )}
      </div>
    </motion.div>
  );
};