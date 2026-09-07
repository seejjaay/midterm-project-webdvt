import { useTransactions } from "../hooks/useTransactions";
import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  isAfter,
  parseISO,
  startOfDay,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { Link, useNavigate } from "react-router";
import { getLocalDateString } from "../utils/date";

const COLORS = [
  "#10b981",
  "#f43f5e",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export default function Dashboard() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("1m");

  const today = startOfDay(new Date());

  // Split past and future transactions
  const { pastTransactions, upcomingPayments } = useMemo(() => {
    const past = [];
    const upcoming = [];
    transactions.forEach((txn) => {
      const txnDate = startOfDay(parseISO(txn.date));
      if (isAfter(txnDate, today)) {
        upcoming.push(txn);
      } else {
        past.push(txn);
      }
    });
    // Sort upcoming by date ascending
    upcoming.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return { pastTransactions: past, upcomingPayments: upcoming };
  }, [transactions, today]);

  // Calculate Balance
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    pastTransactions.forEach((txn) => {
      if (txn.type === "Income") income += txn.amount;
      if (txn.type === "Expense") expense += txn.amount;
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [pastTransactions]);

  // Pie Chart Data: Expenses by Category
  const pieData = useMemo(() => {
    const expensesByCategory = {};
    pastTransactions.forEach((txn) => {
      if (txn.type === "Expense") {
        expensesByCategory[txn.category] =
          (expensesByCategory[txn.category] || 0) + txn.amount;
      }
    });
    return Object.keys(expensesByCategory)
      .map((category) => ({
        name: category,
        value: expensesByCategory[category],
      }))
      .sort((a, b) => b.value - a.value);
  }, [pastTransactions]);

  // Bar Chart Data: Income vs Expense over selected period
  const barData = useMemo(() => {
    let startDate;
    if (period === "1w") startDate = subDays(today, 7);
    else if (period === "1m") startDate = subMonths(today, 1);
    else if (period === "6m") startDate = subMonths(today, 6);
    else if (period === "1y") startDate = subYears(today, 1);

    // Group by date (simplified to just aggregate for the period for now, or group by day/month)
    // Let's group by day if 1w/1m, or month if 6m/1y
    const grouped = {};
    pastTransactions.forEach((txn) => {
      const tDate = parseISO(txn.date);
      if (tDate >= startDate && tDate <= today) {
        // Formatting key based on period
        let key = getLocalDateString(tDate); // default YYYY-MM-DD
        if (period === "6m" || period === "1y") {
          key = key.substring(0, 7); // YYYY-MM
        }

        if (!grouped[key]) grouped[key] = { name: key, Income: 0, Expense: 0 };
        grouped[key][txn.type] += txn.amount;
      }
    });

    return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
  }, [pastTransactions, period, today]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg lg:col-span-1 flex flex-col">
        <h2 className="text-emerald-100 font-medium mb-1">Total Balance</h2>
        <div className="text-4xl font-bold mb-6">
          ₱
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <div className="flex justify-between items-center text-sm mb-6">
          <div>
            <div className="text-emerald-200">Income</div>
            <div className="font-semibold text-lg">
              ₱{totalIncome.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-emerald-200">Expense</div>
            <div className="font-semibold text-lg">
              ₱{totalExpense.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Scrollable list of transactions */}
        <div className="border-t border-emerald-600/50 pt-4 flex-1 flex flex-col min-h-0">
          <h3 className="text-emerald-100 font-medium text-sm mb-3">
            Recent Transactions
          </h3>
          <div className="overflow-y-auto pr-1 space-y-2 max-h-48">
            {transactions
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((txn) => (
                <div
                  key={txn.id}
                  onClick={() => navigate(`/transaction/${txn.id}`)}
                  className="flex justify-between items-center bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors p-3 rounded-xl cursor-pointer"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <div className="font-medium text-sm truncate">
                      {txn.name}
                    </div>
                    <div className="text-xs text-emerald-200/70">
                      {txn.date} &bull; {txn.type}
                    </div>
                  </div>
                  <div
                    className={`font-semibold text-sm whitespace-nowrap ${txn.type === "Income" ? "text-emerald-100" : "text-rose-200"}`}
                  >
                    {txn.type === "Income" ? "+" : "-"}₱
                    {txn.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            {transactions.length === 0 && (
              <div className="text-emerald-200/70 text-sm text-center py-2">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Pie Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-1">
        <h2 className="text-lg font-bold mb-4">Expenses by Category</h2>
        <div className="h-64">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₱${value.toLocaleString()}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No expenses yet
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Upcoming Payments</h2>
          <Link
            to="/calendar"
            className="text-emerald-500 text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4">
          {upcomingPayments.length > 0 ? (
            upcomingPayments.slice(0, 4).map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {payment.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Due: {payment.date}
                  </div>
                </div>
                <div className="font-bold text-rose-500">
                  -₱{payment.amount.toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-center py-4">
              No upcoming payments
            </div>
          )}
        </div>
      </div>

      {/* Income vs Expense Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-bold">Income vs Expenses</h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mt-4 sm:mt-0">
            {["1w", "1m", "6m", "1y"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${period === p ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1e293b",
                    color: "#fff",
                  }}
                  formatter={(value) => `₱${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No data for selected period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
