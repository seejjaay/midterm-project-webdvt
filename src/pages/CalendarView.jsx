import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTransactions } from "../hooks/useTransactions";
import { parseISO, startOfDay, isSameDay } from "date-fns";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

// Add some custom styling to override react-calendar default styles to match our theme
import "./CalendarView.css";

export default function CalendarView() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  const [filterType, setFilterType] = useState("All");

  // Future transactions (upcoming payments)
  const upcomingPayments = useMemo(() => {
    const today = startOfDay(new Date());
    return transactions
      .filter((t) => {
        const matchType = filterType === "All" || t.type === filterType;
        return matchType && startOfDay(parseISO(t.date)) > today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions, filterType]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayTransactions = transactions.filter((t) =>
        isSameDay(parseISO(t.date), date),
      );
      if (dayTransactions.length > 0) {
        return (
          <div className="flex flex-col gap-1 mt-1">
            {dayTransactions.slice(0, 2).map((t) => (
              <div
                key={t.id}
                className={`text-[10px] px-1 rounded truncate text-white ${t.type === "Income" ? "bg-emerald-500" : "bg-rose-500"}`}
              >
                {t.name}
              </div>
            ))}
            {dayTransactions.length > 2 && (
              <div className="text-[10px] text-slate-500">
                +{dayTransactions.length - 2} more
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const handleAddUpcoming = () => {
    // Navigate to Add Transaction with default date pre-filled, or just go to /add
    // Since user wants to input a payment tied to a date, passing state is good.
    // For simplicity, we just navigate to /add.
    navigate("/add");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Future Payments Calendar</h1>
        <div className="flex items-center gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <button
            onClick={handleAddUpcoming}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-sm shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Input Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            className="w-full border-0 !font-sans"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-4">Upcoming Due</h2>
          <div className="text-sm text-slate-500 mb-4">
            {upcomingPayments.length} Scheduled
          </div>

          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                onClick={() => navigate(`/transaction/${payment.id}`)}
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {payment.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Due: {payment.date}
                  </div>
                </div>
                <div
                  className={`font-bold ${payment.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {payment.type === "Income" ? "+" : "-"}₱
                  {payment.amount.toLocaleString()}
                </div>
              </div>
            ))}
            {upcomingPayments.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No upcoming payments found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
