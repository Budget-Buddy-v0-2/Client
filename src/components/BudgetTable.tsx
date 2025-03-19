import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { BudgetItem } from '../types';
import { NumericFormat } from 'react-number-format';

export const BudgetTable: React.FC = () => {
  const { budgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useBudget();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({ name: '', category: '', amount: 0 });
  const [sortConfig, setSortConfig] = useState<{ key: keyof BudgetItem; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof BudgetItem) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedItems = [...budgetItems].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'amount') {
      return (a[sortConfig.key] - b[sortConfig.key]) * direction;
    }
    return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.amount) {
      addBudgetItem(newItem as Required<Omit<BudgetItem, 'id'>>);
      setNewItem({ name: '', category: '', amount: 0 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary">Budget Items</h2>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Item name"
          className="input"
        />
        <input
          type="text"
          value={newItem.category}
          onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
          placeholder="Category"
          className="input"
        />
        <div className="flex gap-2">
          <NumericFormat
            value={newItem.amount}
            onValueChange={(values) => setNewItem(prev => ({ ...prev, amount: values.floatValue || 0 }))}
            thousandSeparator={true}
            prefix="$"
            className="input flex-1"
            placeholder="Amount"
          />
          <button
            onClick={handleAddItem}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-light">
              <th
                className="py-3 px-4 text-left cursor-pointer hover:text-primary"
                onClick={() => handleSort('name')}
              >
                Name
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer hover:text-primary"
                onClick={() => handleSort('category')}
              >
                Category
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer hover:text-primary"
                onClick={() => handleSort('amount')}
              >
                Amount
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-b border-dark-light"
                >
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateBudgetItem(item.id, { name: e.target.value })}
                        className="input w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateBudgetItem(item.id, { category: e.target.value })}
                        className="input w-full"
                      />
                    ) : (
                      item.category
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <NumericFormat
                        value={item.amount}
                        onValueChange={(values) => updateBudgetItem(item.id, { amount: values.floatValue || 0 })}
                        thousandSeparator={true}
                        prefix="$"
                        className="input w-full"
                      />
                    ) : (
                      `$${item.amount.toLocaleString()}`
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === item.id ? (
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn-primary p-2"
                        >
                          <Save size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="btn-secondary p-2"
                        >
                          <Edit2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteBudgetItem(item.id)}
                        className="btn-secondary p-2 text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};