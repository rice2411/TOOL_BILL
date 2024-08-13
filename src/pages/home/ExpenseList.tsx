import React from "react";
import ExpenseItem from "./ExpenseItem";
import { Expense } from "./types";

interface ExpenseListProps {
  expenses: Expense[];
  selectedExpenses: Set<number>;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<Set<number>>>;
  filterDate: string;
  setFilterDate: React.Dispatch<React.SetStateAction<string>>;
  calculateTotalPerPerson: () => void;
  processedExpenses: Set<number>; // Add processedExpenses prop
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  selectedExpenses,
  setSelectedExpenses,
  filterDate,
  setFilterDate,
  calculateTotalPerPerson,
  processedExpenses, // Destructure processedExpenses
}) => {
  const filteredExpenses = filterDate
    ? expenses.filter((expense) => expense.date === filterDate)
    : expenses;

  const resetFilter = () => {
    setFilterDate("");
  };

  const handleCalculateTotal = () => {
    if (selectedExpenses.size === 0) return;
    calculateTotalPerPerson();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Danh sách chi phí</h2>
      <p
        className={`text-sm ${
          selectedExpenses.size === 0
            ? "bg-yellow-100 border border-yellow-300 text-yellow-800 p-2 rounded-md"
            : "text-gray-600"
        } mb-4`}
      >
        {selectedExpenses.size === 0
          ? "Vui lòng chọn ít nhất một hóa đơn để tính tổng."
          : "Nhấn 'Tính Tổng' để tính tổng số tiền mỗi người cần trả."}
      </p>
      <div className="mb-4">
        <label
          htmlFor="filterDate"
          className="block text-sm font-medium text-gray-700"
        >
          Lọc theo ngày
        </label>
        <input
          type="date"
          id="filterDate"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          onClick={resetFilter}
          className="mt-2 py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Đặt lại bộ lọc
        </button>
      </div>
      <ul className="space-y-4 mb-6">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500">Không có chi phí nào để hiển thị.</p>
        ) : (
          filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              selectedExpenses={selectedExpenses}
              setSelectedExpenses={setSelectedExpenses}
              isProcessed={processedExpenses.has(expense.id)} // Use processedExpenses to determine isProcessed
            />
          ))
        )}
      </ul>
      <button
        onClick={handleCalculateTotal}
        disabled={selectedExpenses.size === 0}
        className={`w-full py-2 px-4 mb-4 ${
          selectedExpenses.size === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
      >
        Tính Tổng
      </button>
    </div>
  );
};

export default ExpenseList;
