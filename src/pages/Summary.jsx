import { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { isAfter, parseISO, startOfDay } from 'date-fns';

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Summary() {
  const { transactions } = useTransactions();

  const pieData = useMemo(() => {
    const today = startOfDay(new Date());
    const expensesByCategory = {};
    
    transactions.forEach(txn => {
      const txnDate = startOfDay(parseISO(txn.date));
      // Only include past expenses
      if (txn.type === 'Expense' && !isAfter(txnDate, today)) {
        expensesByCategory[txn.category] = (expensesByCategory[txn.category] || 0) + txn.amount;
      }
    });

    return Object.keys(expensesByCategory).map(category => ({
      name: category,
      value: expensesByCategory[category]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpense = useMemo(() => pieData.reduce((acc, curr) => acc + curr.value, 0), [pieData]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Spending Summary</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-4">Expenses Breakdown</h2>
          <div className="h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₱${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No expenses recorded yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <h2 className="text-lg font-bold mb-4">Category Details</h2>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="text-slate-500 font-medium">Total Past Expenses</span>
            <span className="text-xl font-bold text-rose-500">₱{totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3">
            {pieData.length > 0 ? (
              pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      ₱{item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                    <div className="text-xs text-slate-500">
                      {((item.value / totalExpense) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center py-4">No data to display.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
