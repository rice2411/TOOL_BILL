import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { db } from "../../services/firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useLoaderData } from "react-router-dom";
import { Expense, IAuthContext, IPeople, PersonOption } from "../../interface";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const ExpenseForm: React.FC = () => {
  const { user } = useAuth() as unknown as IAuthContext;
  const peoples = useLoaderData() as unknown as IPeople[];

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
      toast.error("Vui lòng nhập tên khoản chi.");
      return;
    }
    if (!totalAmount) {
      toast.error("Vui lòng nhập tổng số tiền đã chi.");
      return;
    }
    if (!expenseDate) {
      toast.error("Vui lòng chọn ngày.");
      return;
    }

    const total = parseFloat(totalAmount.replace(/\./g, "")) || 0;
    const numberOfPeople = selectedPeople.length;

    if (numberOfPeople === 0) {
      toast.error("Vui lòng chọn ít nhất một người.");
      return;
    }

    const amountPerPerson = total / numberOfPeople;
    const peopleDetails = selectedPeople.map((person) => ({
      id: person.value,
      name: person.label,
      amount: amountPerPerson,
    }));

    const newExpense: Omit<Expense, "id"> = {
      name: expenseName || "Không có tên",
      total,
      amountPerPerson: amountPerPerson,
      people: peopleDetails,
      date: expenseDate,
      creator: user.email,
      status: "Chưa lên bill",
    };

    try {
      await addDoc(collection(db, "expenses"), newExpense);

      const userUpdates = peopleDetails.map(async (personDetail) => {
        const userRef = doc(db, "users", personDetail.id);
        return updateDoc(userRef, {
          amount:
            (personDetail.amount || 0) + (await getUserAmount(personDetail.id)),
        });
      });

      await Promise.all(userUpdates);

      setExpenseName("");
      setTotalAmount("");
      setSelectedPeople([]);
      setExpenseDate("");
      toast.success(
        "Khoản chi đã được tạo thành công và số tiền của người tham gia đã được cập nhật!"
      );
    } catch (error) {
      console.error("Error adding expense: ", error);
      toast.error("Có lỗi xảy ra khi lưu khoản chi.");
    }
  };

  const getUserAmount = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      return userData?.amount || 0;
    } catch (error) {
      console.error("Error fetching user amount: ", error);
      return 0;
    }
  };

  useEffect(() => {
    const peopleOptions: PersonOption[] = peoples.map((people: IPeople) => ({
      value: people.id,
      label: people.name,
    }));
    setPeopleOptions(peopleOptions);
  }, [peoples]);

  const isFormValid = () => {
    return (
      expenseName && totalAmount && expenseDate && selectedPeople.length > 0
    );
  };

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
        className={`w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isFormValid() ? "" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!isFormValid()}
      >
        Tạo
      </button>
      <ToastContainer /> {/* Include ToastContainer here */}
    </div>
  );
};

export default ExpenseForm;
