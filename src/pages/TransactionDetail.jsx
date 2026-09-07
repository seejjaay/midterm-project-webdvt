import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, updateTransaction, deleteTransaction } =
    useTransactions();
  const transaction = transactions.find((t) => t.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(transaction);

  if (!formData) {
    return (
      <div className="text-center text-slate-500 py-12">
        Transaction not found
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
      navigate("/records");
    }
  };

  const handleSave = () => {
    updateTransaction(id, {
      ...formData,
      amount: Number(formData.amount),
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          &larr; Back
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <h2 className="text-xl font-bold">{formData.name}</h2>
            )}
            <div className="text-sm text-slate-500 mt-1">
              {new Date(formData.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 w-32 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div
                className={`text-2xl font-bold ${formData.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}
              >
                {formData.type === "Income" ? "+" : "-"}₱
                {Number(formData.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Type
            </label>
            {isEditing ? (
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            ) : (
              <div className="font-medium">{formData.type}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Category
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div className="font-medium">{formData.category}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Mode
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.mode}
                onChange={(e) =>
                  setFormData({ ...formData, mode: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div className="font-medium">{formData.mode}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Date
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div className="font-medium">{formData.date}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">
            Description
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <div className="font-medium whitespace-pre-wrap">
              {formData.description || "No description provided."}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          <button
            onClick={handleDelete}
            className="text-rose-500 hover:text-rose-600 font-medium px-4 py-2"
          >
            Delete Transaction
          </button>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-medium shadow-sm shadow-emerald-500/20"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 rounded-xl bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-medium shadow-sm"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
