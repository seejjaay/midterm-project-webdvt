import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useNavigate } from 'react-router';

export default function AddTransaction() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Expense',
    category: '',
    mode: 'Cash',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  
  const [errors, setErrors] = useState({});

  const categories = [
    'Food', 'Housing', 'Transportation', 'Utilities', 
    'Clothing', 'Healthcare', 'Education', 'Personal', 
    'Entertainment', 'Salary', 'Side Hustle', 'Other'
  ];

  const modes = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'GCash', 'PayPal'];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addTransaction({
        ...formData,
        amount: Number(formData.amount)
      });
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Transaction Record</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter transaction name"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Type (Income/Expense toggle) */}
        <div>
          <label className="block text-sm font-medium mb-2">Expense / Income</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="type" 
                checked={formData.type === 'Expense'} 
                onChange={() => setFormData({...formData, type: 'Expense'})}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span className={formData.type === 'Expense' ? 'text-rose-500 font-medium' : ''}>Expense</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="type" 
                checked={formData.type === 'Income'} 
                onChange={() => setFormData({...formData, type: 'Income'})}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span className={formData.type === 'Income' ? 'text-emerald-500 font-medium' : ''}>Income</span>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₱</span>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {errors.amount && <p className="text-rose-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-rose-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({...formData, mode: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {modes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.date && <p className="text-rose-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Add any relevant details..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-sm shadow-emerald-500/20"
          >
            Save Record
          </button>
        </div>
      </form>
    </div>
  );
}
