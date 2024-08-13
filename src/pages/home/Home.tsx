import React, { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { Expense } from "./types";
import TotalPerPersonItem from "./TotalPerPersonItem";

const ExpenseSplitter: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalPerPerson, setTotalPerPerson] = useState<Record<string, number>>(
    {}
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [calculationDate, setCalculationDate] = useState<string>("");

  const [filterDate, setFilterDate] = useState<string>("");
  const [bills, setBills] = useState<
    {
      total: number;
      totalPerPerson: Record<string, number>;
      calculationDate: string;
    }[]
  >([]);
  const [processedExpenses, setProcessedExpenses] = useState<Set<number>>(
    new Set()
  );

  const addExpense = (newExpense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const calculateTotalPerPerson = () => {
    const totals: Record<string, number> = {};
    let total = 0;

    const newBill = {
      total,
      totalPerPerson: totals,
      calculationDate: new Date().toLocaleDateString(),
    };

    setBills((prevBills) => [...prevBills, newBill]);
    setTotalAmount(total);
    setCalculationDate(newBill.calculationDate); // Update the latest calculation date

    // Update processed expenses
    setProcessedExpenses((prevProcessedExpenses) => {
      const updatedProcessedExpenses = new Set(prevProcessedExpenses);
      return updatedProcessedExpenses;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <ExpenseForm addExpense={addExpense} />

        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">
            Tổng số tiền mỗi người cần trả
          </h2>
          {bills.length > 0 ? (
            bills.map((bill, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-bold mb-2">Bill #{index + 1}</h3>
                {Object.entries(bill.totalPerPerson).map(
                  ([person, total], idx) => (
                    <TotalPerPersonItem
                      key={idx}
                      person={person}
                      total={total}
                      calculationDate={bill.calculationDate}
                    />
                  )
                )}
                <p className="font-semibold mt-2">
                  Tổng số tiền:{" "}
                  {bill.total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Không có dữ liệu. Nhấn "Tính Tổng" để xem kết quả.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseSplitter;
