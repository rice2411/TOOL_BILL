import React from "react";
import { Expense, IPeople } from "../../interface";
import { formatCurrency } from "../../utils";

interface ExpenseCardProps {
  expense: Expense;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void; // New prop for delete action
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const isBilled = expense.status.toLowerCase() === "đã lên bill";

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
      onDelete(expense.id);
    }
  };

  return (
    <div
      onClick={!isBilled ? onSelect : undefined}
      className={`p-4 rounded-lg shadow-md relative ${
        isBilled
          ? "bg-green-100 border border-green-400 cursor-not-allowed"
          : isSelected
          ? "bg-indigo-100 border border-indigo-400 cursor-pointer"
          : "bg-white cursor-pointer"
      }`}
    >
      {/* Delete Button */}
      {!isBilled && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent click event from bubbling up
            handleDelete();
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          X
        </button>
      )}
      <h3 className="font-semibold text-lg mb-2">{expense.name}</h3>
      <p className="text-gray-700 font-bold">
        Tổng: {formatCurrency(expense.total)}
      </p>
      <div className="mb-2">
        <p className="text-gray-700 font-bold">Chi tiết số tiền:</p>
        {expense.people.map((person: IPeople) => (
          <p key={person.id} className="text-gray-500">
            {person.name}: {formatCurrency(person.amount)}
          </p>
        ))}
      </div>
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
