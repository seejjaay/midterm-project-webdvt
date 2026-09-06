import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';

// PERF OPTIMIZATION: We wrap the TransactionRow in React.memo.
// Problem: If the parent Records component re-renders (e.g. because the user types in the search filter, or a global theme change forces a re-render), every single row in the table would normally re-render as well. For a large transaction history, this can cause significant lag.
// Fix: By wrapping it in React.memo, React will skip re-rendering this row component unless its specific props (the transaction object) change.
const TransactionRow = React.memo(({ txn, onClick }) => {
  return (
    <tr 
      onClick={() => onClick(txn.id)}
      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3 font-medium">{txn.name}</td>
      <td className={`px-4 py-3 font-semibold ${txn.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {txn.type}
      </td>
      <td className="px-4 py-3">{txn.category}</td>
      <td className="px-4 py-3">{txn.mode}</td>
      <td className={`px-4 py-3 font-bold ${txn.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {txn.type === 'Income' ? '+' : '-'}₱{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-slate-500">{txn.date}</td>
      <td className="px-4 py-3 text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
    </tr>
  );
});

export default function Records() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories for the filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [transactions]);

  // PERF OPTIMIZATION: Memoizing the filtered list.
  // Problem: Filtering a large array of transactions on every render (e.g. when typing in a search bar or if the theme changes) is computationally expensive.
  // Fix: useMemo ensures the filtering logic only runs when `transactions`, `filterType`, `filterCategory`, or `searchQuery` actually change, preventing unnecessary recalculations during unrelated state updates.
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchType = filterType === 'All' || txn.type === filterType;
      const matchCategory = filterCategory === 'All' || txn.category === filterCategory;
      const matchSearch = txn.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchCategory && matchSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory, searchQuery]);

  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0, exp = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'Income') inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp };
  }, [filteredTransactions]);

  const handleRowClick = (id) => {
    navigate(`/transaction/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Transaction Records</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-slate-500">Filtered Balance: </span>
            <span className={`font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ₱{(totalIncome - totalExpense).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Income/Expense</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Transaction Date</th>
                <th className="px-4 py-3 font-medium">Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(txn => (
                  <TransactionRow key={txn.id} txn={txn} onClick={handleRowClick} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
