import React, { useState } from "react";
import { Expense } from "../../../interface";
import { useLoaderData } from "react-router-dom";

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const CreateBill: React.FC = () => {
  const expenses: any = useLoaderData();
  const [filterDate, setFilterDate] = useState<string>("");
  const [processedExpenses, setProcessedExpenses] = useState<Set<number>>(
    new Set()
  );
  const [bills, setBills] = useState<
    {
      total: number;
      totalPerPerson: Record<string, number>;
      calculationDate: string;
    }[]
  >([]);
  const [selectedExpenses, setSelectedExpenses] = useState<Set<number>>(
    new Set()
  );
  const filteredExpenses = filterDate
    ? expenses.filter((expense: Expense) => expense.date === filterDate)
    : expenses;

  const resetFilter = () => {
    setFilterDate("");
  };

  const calculateTotalPerPerson = () => {
    const totals: Record<string, number> = {};
    let total = 0;

    expenses.forEach((expense: Expense) => {
      if (selectedExpenses.has(expense.id)) {
        total += expense.total; // Add the total amount of the selected expense
        expense.people.forEach((person) => {
          if (!totals[person]) {
            totals[person] = 0;
          }
          totals[person] += expense.amountPerPerson;
        });
      }
    });

    const newBill = {
      total,
      totalPerPerson: totals,
      calculationDate: new Date().toLocaleDateString(),
    };

    setBills((prevBills) => [...prevBills, newBill]);
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
      <div className="overflow-x-auto">
        <table className="min-w-full max-w-7xl divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người tham gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chọn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-gray-500 text-center">
                  Không có chi phí nào để hiển thị.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense: Expense) => (
                <tr
                  key={expense.id}
                  className={`${
                    processedExpenses.has(expense.id) ? "bg-gray-300" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {expense.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatCurrency(expense.total)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.people.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.creator}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.status}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="checkbox"
                      disabled={processedExpenses.has(expense.id)}
                      checked={selectedExpenses.has(expense.id)}
                      onChange={() => {
                        setSelectedExpenses((prevSelectedExpenses) => {
                          const updatedSelection = new Set(
                            prevSelectedExpenses
                          );
                          if (updatedSelection.has(expense.id)) {
                            updatedSelection.delete(expense.id);
                          } else {
                            updatedSelection.add(expense.id);
                          }
                          return updatedSelection;
                        });
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleCalculateTotal}
        disabled={selectedExpenses.size === 0}
        className={`w-full py-2 px-4 mt-4 ${
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

export default CreateBill;
