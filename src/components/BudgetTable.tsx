import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { BudgetItem } from '../types';
import { NumericFormat } from 'react-number-format';

export const BudgetTable: React.FC = () => {
  const { budgetItems, addBudgetItem, deleteBudgetItem } = useBudget();
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
    name: '',
    category: '',
    amount: 0,
    color: '#ffffff',
  });

  // 🆕 Category state
  const [categories, setCategories] = useState<{ name: string; color: string }[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCategory, setNewCategory] = useState<{ name: string; color: string }>({
    name: '',
    color: '#ffffff',
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.amount) {
      addBudgetItem(newItem as Required<Omit<BudgetItem, 'id'>>);
      setNewItem({ name: '', category: '', amount: 0, color: '#ffffff' });
      setIsAddingItem(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      setCategories([...categories, newCategory]);
      setNewCategory({ name: '', color: '#ffffff' });
      setIsAddingCategory(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Budget Items</h2>
        <div className="flex gap-4">
          <button onClick={() => setIsAddingItem(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Item
          </button>
          <button onClick={() => setIsAddingCategory(true)} className="btn-secondary flex items-center gap-2">
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* 🆕 Add Item Modal */}
      <AnimatePresence>
        {isAddingItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsAddingItem(false)}
          >
            <motion.div onClick={(e) => e.stopPropagation()} className="bg-dark p-6 rounded-lg shadow-md w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Budget Item</h3>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Item name"
                className="input mb-3 w-full"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
                className="input mb-3 w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <NumericFormat
                value={newItem.amount}
                onValueChange={(values) => setNewItem((prev) => ({ ...prev, amount: values.floatValue || 0 }))}
                thousandSeparator={true}
                prefix="$"
                className="input mb-3 w-full"
                placeholder="Amount"
              />
              <div className="flex gap-2">
                <button onClick={handleAddItem} className="btn-primary">Save</button>
                <button onClick={() => setIsAddingItem(false)} className="btn-secondary">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🆕 Add Category Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsAddingCategory(false)}
          >
            <motion.div onClick={(e) => e.stopPropagation()} className="bg-dark p-6 rounded-lg shadow-md w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Category Name"
                className="input mb-3 w-full"
              />
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, color: e.target.value }))}
                className="w-10 h-10 border border-gray-600 rounded-md cursor-pointer mb-3"
              />
              <div className="flex gap-2">
                <button onClick={handleAddCategory} className="btn-primary">Save</button>
                <button onClick={() => setIsAddingCategory(false)} className="btn-secondary">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-light">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {budgetItems.map((item) => {
                const categoryColor = categories.find((c) => c.name === item.category)?.color || '#ffffff';
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }} // 🔥 Delete Animation: Fade & Slide Right
                    className="border-b border-dark-light"
                    style={{ borderLeft: `5px solid ${categoryColor}` }}
                  >
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">${item.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteBudgetItem(item.id)} className="text-red-500 hover:text-red-400">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};