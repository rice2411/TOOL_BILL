import React from "react";
import { Expense } from "../../../interface";

interface ExpenseItemProps {
  expense: Expense;
  selectedExpenses: Set<number>;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<Set<number>>>;
  isProcessed: boolean;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  selectedExpenses,
  setSelectedExpenses,
  isProcessed,
}) => {
  const isSelected = selectedExpenses.has(expense.id);

  const handleSelection = () => {
    if (isProcessed) return; // Prevent selection if already processed

    setSelectedExpenses((prevSelectedExpenses) => {
      const updatedSelection = new Set(prevSelectedExpenses);
      if (isSelected) {
        updatedSelection.delete(expense.id);
      } else {
        updatedSelection.add(expense.id);
      }
      return updatedSelection;
    });
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <li
      onClick={handleSelection}
      className={`p-4 rounded-md flex items-center cursor-pointer ${
        isProcessed
          ? "bg-gray-300 border border-gray-500 text-gray-800 cursor-not-allowed"
          : isSelected
          ? "bg-indigo-200 border border-indigo-400"
          : "bg-gray-200"
      }`}
    >
      <div>
        <p className="font-semibold">{expense.name}</p>
        <p>Tổng: {formatCurrency(expense?.total || 0)}</p>
        <p>Người tham gia: {expense?.people?.join(", ") || ""}</p>
        <p>Ngày tạo: {expense.date}</p>
        <p>Người tạo: {expense.creator}</p>
      </div>
    </li>
  );
};

export default ExpenseItem;
