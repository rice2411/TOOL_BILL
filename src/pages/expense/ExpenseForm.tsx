import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { db } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useLoaderData } from "react-router-dom";
import { IUser } from "../../interface/user";
import { Expense, PersonOption } from "../home/types";

const ExpenseForm: React.FC = () => {
  const { user }: any = useAuth();
  const peoples: any = useLoaderData();
  const [peopleOptions, setPeopleOptions] = useState<PersonOption[]>([]);
  const [expenseName, setExpenseName] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [selectedPeople, setSelectedPeople] = useState<
    MultiValue<PersonOption>
  >([]);
  const [expenseDate, setExpenseDate] = useState<string>("");

  const handleCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const createExpense = async () => {
    if (!expenseName) {
      alert("Vui lòng nhập tên khoản chi.");
      return;
    }
    if (!totalAmount) {
      alert("Vui lòng nhập tổng số tiền đã chi.");
      return;
    }
    if (!expenseDate) {
      alert("Vui lòng chọn ngày.");
      return;
    }

    const total = parseFloat(totalAmount.replace(/\./g, "")) || 0;
    const numberOfPeople = selectedPeople.length;

    if (numberOfPeople === 0) {
      alert("Vui lòng chọn ít nhất một người.");
      return;
    }

    const amountPerPerson = total / numberOfPeople;
    const newExpense: Expense = {
      id: Date.now(),
      name: expenseName || "Không có tên",
      total,
      amountPerPerson: amountPerPerson,
      people: selectedPeople.map((person) => person.label),
      date: expenseDate,
      creator: user.email,
    };

    try {
      // Add the expense to Firebase Firestore
      await addDoc(collection(db, "expenses"), newExpense);
      // Reset the form fields
      setExpenseName("");
      setTotalAmount("");
      setSelectedPeople([]);
      setExpenseDate("");
    } catch (error) {
      console.error("Error adding expense: ", error);
      alert("Có lỗi xảy ra khi lưu khoản chi.");
    }
  };

  useEffect(() => {
    const peopleOptions: PersonOption[] = peoples.map((people: IUser) => {
      return {
        value: people.id,
        label: people.name,
      };
    });
    setPeopleOptions(peopleOptions);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Tính tiền chia sau buổi đi chơi
      </h1>
      <div className="mb-4">
        <label
          htmlFor="expenseName"
          className="block text-sm font-medium text-gray-700"
        >
          Tên của khoản chi
        </label>
        <input
          type="text"
          id="expenseName"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          placeholder="Ví dụ: Bữa tối, Vé xem phim..."
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="totalAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Tổng số tiền đã chi (VND)
        </label>
        <input
          type="text"
          id="totalAmount"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={totalAmount}
          onChange={(e) => setTotalAmount(handleCurrencyInput(e.target.value))}
          placeholder="Nhập số tiền..."
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="people"
          className="block text-sm font-medium text-gray-700"
        >
          Chọn người
        </label>
        <Select
          isMulti
          options={peopleOptions}
          className="mt-1"
          value={selectedPeople}
          onChange={setSelectedPeople}
          placeholder="Chọn người tham gia..."
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="expenseDate"
          className="block text-sm font-medium text-gray-700"
        >
          Ngày tạo
        </label>
        <input
          type="date"
          id="expenseDate"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />
      </div>
      <button
        onClick={createExpense}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Tạo
      </button>
    </div>
  );
};

export default ExpenseForm;
