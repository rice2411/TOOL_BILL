import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Expense, IAuthContext, IPeople } from "../../interface";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import ExpenseCard from "./ExpenseCard";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

const Invoice: React.FC = () => {
  const expenses = useLoaderData() as unknown as Expense[];
  const { user } = useAuth() as unknown as IAuthContext;
  const [filterDate, setFilterDate] = useState<string>("");
  const [billedExpenses, setBilledExpenses] = useState<Set<string>>(new Set());
  const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(
    new Set()
  );
  const [data, setData] = useState<Expense[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false); // New state for filtering all items

  const resetFilter = () => {
    setFilterDate("");
    setShowAll(false); // Reset to show only not billed items
  };

  const calculateTotalPerPerson = async () => {
    if (selectedExpenses.size === 0) return;

    const totals: Record<string, number> = {};
    let totalAmount = 0;
    const selectedExpensesList: Expense[] = [];

    // Calculate total amount and amount per person
    expenses.forEach((expense: Expense) => {
      if (selectedExpenses.has(expense.id)) {
        totalAmount += expense.total;
        selectedExpensesList.push(expense);
        expense.people.forEach((person: IPeople) => {
          if (!totals[person.name]) {
            totals[person.name] = 0;
          }
          totals[person.name] += person.amount;
        });
      }
    });

    const newBill = {
      name: `Bill ${new Date().toLocaleDateString()}`,
      total: totalAmount,
      totalPerPerson: totals,
      calculationDate: new Date().toLocaleDateString(),
      creator: user.email,
    };

    try {
      // Add new bill to Firebase
      const billDocRef = await addDoc(collection(db, "bills"), newBill);
      console.log("Bill document written with ID: ", billDocRef.id);

      // Update status of selected expenses in Firebase to "đã lên bill"
      await Promise.all(
        selectedExpensesList.map(async (expense) => {
          const expenseDocRef = doc(db, "expenses", expense.id.toString());
          await updateDoc(expenseDocRef, { status: "đã lên bill" });
        })
      );

      // Update the state for billed expenses
      setBilledExpenses((prevBilledExpenses) => {
        const updatedBilled = new Set(prevBilledExpenses);
        selectedExpenses.forEach((expenseId) => {
          updatedBilled.add(expenseId);
        });
        return updatedBilled;
      });

      // Update expenses to mark selected expenses as "đã lên bill"
      setData((prevExpenses) => {
        return prevExpenses.map((expense: Expense) => {
          if (selectedExpenses.has(expense.id)) {
            return { ...expense, status: "đã lên bill" };
          }
          return expense;
        });
      });

      // Clear selected expenses after processing
      setSelectedExpenses(new Set());
    } catch (e) {
      console.error("Error updating documents: ", e);
    }
  };

  useEffect(() => {
    let filteredExpenses = expenses;

    // Filter by date if filterDate is set
    if (filterDate) {
      filteredExpenses = filteredExpenses.filter(
        (expense: Expense) => expense.date === filterDate
      );
    }

    // Further filter by status if showAll is not true
    if (!showAll) {
      filteredExpenses = filteredExpenses.filter(
        (expense: Expense) => expense.status.toLowerCase() === "chưa lên bill"
      );
    }

    setData(filteredExpenses);
  }, [filterDate, showAll, expenses]);

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
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
          <div className="flex-1">
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
          </div>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="mt-2 sm:mt-0 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showAll ? "Hiển thị chưa lên bill" : "Hiển thị tất cả"}
          </button>
          <button
            onClick={resetFilter}
            className="mt-2 sm:mt-0 py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Không có chi phí nào để hiển thị.
          </div>
        ) : (
          data.map((expense: Expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              isSelected={selectedExpenses.has(expense.id)}
              onSelect={() => {
                if (billedExpenses.has(expense.id)) return; // Prevent selecting if already billed

                setSelectedExpenses((prevSelectedExpenses) => {
                  const updatedSelection = new Set(prevSelectedExpenses);
                  if (updatedSelection.has(expense.id)) {
                    updatedSelection.delete(expense.id);
                  } else {
                    updatedSelection.add(expense.id);
                  }
                  return updatedSelection;
                });
              }}
            />
          ))
        )}
      </div>
      <button
        onClick={calculateTotalPerPerson}
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

export default Invoice;
