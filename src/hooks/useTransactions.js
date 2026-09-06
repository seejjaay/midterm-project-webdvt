import { useState, useEffect, useCallback } from 'react';
// Let's use a simple ID generator to avoid adding more deps if we don't have to.
// Let's use a simple ID generator to avoid adding more deps if we don't have to, but uuid is nice.
// We can just use Math.random().toString(36).substring(2, 9)

const STORAGE_KEY = 'walletter_transactions';

const initialMockData = [
  {
    id: '1',
    name: 'Salary',
    type: 'Income',
    category: 'Salary',
    mode: 'Bank Transfer',
    amount: 5000,
    date: '2026-08-01',
    createdAt: '2026-08-01T10:00:00Z',
    description: 'August Salary',
  },
  {
    id: '2',
    name: 'Burger Steak',
    type: 'Expense',
    category: 'Food',
    mode: 'Cash',
    amount: 500,
    date: '2026-08-19',
    createdAt: '2026-08-19T12:30:00Z',
    description: 'Lunch',
  },
  {
    id: '3',
    name: 'House Rent',
    type: 'Expense',
    category: 'Housing',
    mode: 'Bank Transfer',
    amount: 12000,
    date: '2026-08-28', // Upcoming in the mock screenshots
    createdAt: '2026-08-01T11:00:00Z',
    description: 'Monthly Rent',
  },
  {
    id: '4',
    name: 'Tuition Fee',
    type: 'Expense',
    category: 'Education',
    mode: 'Bank Transfer',
    amount: 4500,
    date: '2026-08-25', // Upcoming
    createdAt: '2026-08-01T11:05:00Z',
    description: 'School Tuition',
  },
  {
    id: '5',
    name: 'Electricity Bill',
    type: 'Expense',
    category: 'Utilities',
    mode: 'GCash',
    amount: 2150,
    date: '2026-08-30', // Upcoming
    createdAt: '2026-08-01T11:10:00Z',
    description: 'Meralco',
  },
  {
    id: '6',
    name: 'Freelance Design',
    type: 'Income',
    category: 'Side Hustle',
    mode: 'PayPal',
    amount: 1500,
    date: '2026-08-10',
    createdAt: '2026-08-10T14:00:00Z',
    description: 'Logo design project',
  },
  {
    id: '7',
    name: 'New Shoes',
    type: 'Expense',
    category: 'Clothing',
    mode: 'Credit Card',
    amount: 3200,
    date: '2026-08-15',
    createdAt: '2026-08-15T16:20:00Z',
    description: 'Running shoes',
  }
];

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse transactions from local storage', e);
        return initialMockData;
      }
    }
    // Seed with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
    return initialMockData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((txn) => {
    const newTxn = {
      ...txn,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [...prev, newTxn]);
    return newTxn;
  }, []);

  const updateTransaction = useCallback((id, updatedTxn) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, ...updatedTxn } : txn))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  }, []);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
