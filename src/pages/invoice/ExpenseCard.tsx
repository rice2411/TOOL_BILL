import React from "react";
import { Expense, IPeople } from "../../interface";
import { formatCurrency } from "../../utils";

interface ExpenseCardProps {
  expense: Expense;
  isSelected: boolean;
  onSelect: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  isSelected,
  onSelect,
}) => {
  const isBilled = expense.status.toLowerCase() === "đã lên bill";

  return (
    <div
      onClick={!isBilled ? onSelect : undefined}
      className={`p-4 rounded-lg shadow-md ${
        isBilled
          ? "bg-green-100 border border-green-400 cursor-not-allowed"
          : isSelected
          ? "bg-indigo-100 border border-indigo-400 cursor-pointer"
          : "bg-white cursor-pointer"
      }`}
    >
      <h3 className="font-semibold text-lg mb-2">{expense.name}</h3>
      <p className="text-gray-700 font-bold">
        Tổng: {formatCurrency(expense.total)}
      </p>
      <p className="text-gray-500">
        Người tham gia:{" "}
        {expense.people.map((person: IPeople) => person.name).join(", ")}
      </p>
      <p className="text-gray-500">Ngày tạo: {expense.date}</p>
      <p className="text-gray-500">Người tạo: {expense.creator}</p>
      <p
        className={`text-sm font-medium ${
          isBilled
            ? "text-green-600"
            : isSelected
            ? "text-indigo-600"
            : "text-red-600"
        }`}
      >
        Trạng thái: {expense.status}
      </p>
    </div>
  );
};

export default ExpenseCard;
