
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { BudgetItem } from '../types';
import { NumericFormat } from 'react-number-format';

export const BudgetTable: React.FC = () => {
  const { budgetItems, addBudgetItem, deleteBudgetItem, updateBudgetItem } = useBudget();
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
    name: '',
    category: '',
    amount: 0,
    color: '#ffffff',
  });

  const [categories, setCategories] = useState<{ name: string; color: string }[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCategory, setNewCategory] = useState<{ name: string; color: string }>({
    name: '',
    color: '#ffffff',
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<BudgetItem>>({});

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.amount) {
      addBudgetItem(newItem as Required<Omit<BudgetItem, 'id'>>);
      setNewItem({ name: '', category: '', amount: 0, color: '#ffffff' });
      setIsAddingItem(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      setCategories((prev) => [...prev, { name: newCategory.name, color: newCategory.color }]);
      setNewCategory({ name: '', color: '#ffffff' });
      setIsAddingCategory(false);
    }
  };

  const handleEdit = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setEditedItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (editingItemId && editedItem.name && editedItem.category && editedItem.amount) {
      updateBudgetItem(editingItemId, editedItem as BudgetItem);
      setEditingItemId(null);
      setEditedItem({}); // ✅ Reset the edit state after saving
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary">Budget Items</h2>
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          <button onClick={() => setIsAddingItem(true)} className="btn-primary flex items-center gap-2 text-sm md:text-base px-4 py-2">
            <Plus size={20} />
            Add Item
          </button>
          <button onClick={() => setIsAddingCategory(true)} className="btn-secondary flex items-center gap-2 text-sm md:text-base px-4 py-2">
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* ✅ Add Item Modal */}
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

      {/* ✅ Add Category Modal */}
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

      {/* ✅ Budget Table (WITH SWIPE TO DELETE & EDIT BUTTON) */}
      <div className="overflow-hidden md:overflow-x-auto">
        <table className="w-full md:min-w-[600px] table-fixed">
          <thead>
            <tr className="border-b border-dark-light text-sm md:text-base">
              <th className="py-3 px-2 md:px-4 text-left w-1/3">Name</th>
              <th className="hidden md:table-cell py-3 px-2 md:px-4 text-left w-1/3">Category</th>
              <th className="py-3 px-2 md:px-4 text-right w-1/3">Amount</th>
              <th className="hidden md:table-cell py-3 px-2 md:px-4 text-right w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item) => {
              const categoryColor = categories.find((c) => c.name === item.category)?.color || '#ffffff';

              return (
                <motion.tr
                  key={item.id}
                  className="border-b border-dark-light text-sm md:text-base relative"
                  style={{
                    borderLeft: `6px solid ${categoryColor}`, // ✅ Thicker category color border
                    height: "3.5rem", // ✅ Increased row height
                  }}
                >
                  {/* Editable Name */}
                  <td className="py-3 px-4"> {/* ✅ Added padding */}
                    {editingItemId === item.id ? (
                      <input
                        type="text"
                        value={editedItem.name || ""}
                        onChange={(e) => setEditedItem((prev) => ({ ...prev, name: e.target.value }))}
                        className="input w-full py-2" // ✅ Better input padding
                      />
                    ) : (
                      <span className="block truncate">{item.name}</span> // ✅ Truncate long names
                    )}
                  </td>

                  {/* Editable Category */}
                  <td className="hidden md:table-cell py-3 px-4">
                    {editingItemId === item.id ? (
                      <select
                        value={editedItem.category || ""}
                        onChange={(e) => setEditedItem((prev) => ({ ...prev, category: e.target.value }))}
                        className="input w-full py-2"
                      >
                        {categories.map((category, index) => (
                          <option key={index} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="block truncate">{item.category}</span>
                    )}
                  </td>

                  {/* Editable Amount */}
                  <td className="py-3 px-4 text-right">
                    {editingItemId === item.id ? (
                      <NumericFormat
                        value={editedItem.amount || ""}
                        onValueChange={(values) => setEditedItem((prev) => ({ ...prev, amount: values.floatValue || 0 }))}
                        thousandSeparator={true}
                        prefix="$"
                        className="input w-full py-2 text-right"
                      />
                    ) : (
                      <span className="font-semibold text-primary">${item.amount.toLocaleString()}</span> // ✅ Slightly bold & colored
                    )}
                  </td>

                  {/* Edit & Delete Actions */}
                  <td className="hidden md:table-cell py-3 px-4 text-right">
                    {editingItemId === item.id ? (
                      <button onClick={handleSaveEdit} className="btn-primary px-3 py-2">
                        <Save size={18} />
                      </button>
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-400 transition">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteBudgetItem(item.id)} className="text-red-500 hover:text-red-400 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};