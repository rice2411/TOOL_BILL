import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { db } from "../../services/firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useLoaderData } from "react-router-dom";
import {
  Expense,
  IAuthContext,
  IPeople,
  PersonOption,
  PersonSplit,
} from "../../interface";
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
  const [isSplitEqually, setIsSplitEqually] = useState<boolean>(true);
  const [personSplits, setPersonSplits] = useState<PersonSplit[]>([]);
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<Set<string>>(
    new Set()
  );
  const [isSplitDisabled, setIsSplitDisabled] = useState<boolean>(false);
  const [isTotalExceeded, setIsTotalExceeded] = useState<boolean>(false);

  const handleCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const checkTotalExceeded = () => {
    const splitItemsTotal = personSplits.reduce((total, split) => {
      return (
        total +
        split.items.reduce(
          (sum, item) =>
            sum + (parseFloat(item.amount.replace(/\./g, "")) || 0),
          0
        )
      );
    }, 0);

    return splitItemsTotal > parseFloat(totalAmount.replace(/\./g, ""));
  };

  const checkSplitTotal = () => {
    const splitItemsTotal = personSplits.reduce((total, split) => {
      return (
        total +
        split.items.reduce(
          (sum, item) =>
            sum + (parseFloat(item.amount.replace(/\./g, "")) || 0),
          0
        )
      );
    }, 0);

    return splitItemsTotal >= parseFloat(totalAmount.replace(/\./g, ""));
  };

  const createExpense = async () => {
    if (!expenseName) {
      toast.error("Vui lòng nhập tên khoản chi.");
      return;
    }
    if (!totalAmount && isSplitEqually) {
      toast.error("Vui lòng nhập tổng số tiền đã chi.");
      return;
    }
    if (!expenseDate) {
      toast.error("Vui lòng chọn ngày.");
      return;
    }

    let peopleDetails: { id: string; name: string; amount: number }[] = [];
    let total = 0;

    if (isSplitEqually) {
      total = parseFloat(totalAmount.replace(/\./g, "")) || 0;
      const numberOfPeople = selectedPeople.length;

      if (numberOfPeople === 0) {
        toast.error("Vui lòng chọn ít nhất một người.");
        return;
      }

      const amountPerPerson = total / numberOfPeople;
      peopleDetails = selectedPeople.map((person) => ({
        id: person.value,
        name: person.label,
        amount: amountPerPerson,
      }));
    } else {
      const invalidSplits = personSplits.some((split) =>
        split.items.some((item) => !item.name || !item.amount)
      );

      if (invalidSplits) {
        toast.error(
          "Vui lòng nhập đầy đủ thông tin cho tất cả các mục chia lẻ."
        );
        return;
      }

      const selectedPeopleDetails = selectedPeople.map((person) => ({
        id: person.value,
        name: person.label,
        amount: 0,
      }));

      peopleDetails = personSplits
        .filter((split) => split.items.length > 0)
        .map((split) => {
          const totalAmountForPerson = split.items.reduce(
            (sum, item) =>
              sum + (parseFloat(item.amount.replace(/\./g, "")) || 0),
            0
          );
          total += totalAmountForPerson;
          return {
            id: split.personId,
            name: split.personName,
            amount: totalAmountForPerson,
          };
        });

      selectedPeopleDetails.forEach((person) => {
        const existingPerson = peopleDetails.find(
          (detail) => detail.id === person.id
        );
        if (!existingPerson) {
          peopleDetails.push(person);
        }
      });

      const remainingTotal = parseFloat(totalAmount.replace(/\./g, "")) - total;
      const numberOfSelectedPeople = selectedPeopleDetails.length;
      const amountPerPerson = remainingTotal / numberOfSelectedPeople;

      peopleDetails = peopleDetails.map((person) => {
        if (person.amount === 0) {
          person.amount = amountPerPerson;
          total += amountPerPerson;
        }
        return person;
      });
    }

    peopleDetails = peopleDetails.filter((person) => person.amount > 0);

    if (peopleDetails.length === 0) {
      toast.error("Không có người nào hợp lệ để tạo khoản chi.");
      return;
    }

    const newExpense: Omit<Expense, "id"> = {
      name: expenseName || "Không có tên",
      total,
      amountPerPerson: isSplitEqually ? total / selectedPeople.length : 0,
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
      setPersonSplits([]);
      setSelectedPeopleIds(new Set());
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

  const handleAddSplitItem = (personId: string) => {
    if (selectedPeopleIds.has(personId)) {
      toast.error("Người đã được chọn trong danh sách.");
      return;
    }

    // Check if the person already has items with empty fields
    const hasEmptyFields = personSplits.some(
      (split) =>
        split.personId === personId &&
        split.items.some((item) => !item.name || !item.amount)
    );

    if (hasEmptyFields) {
      toast.error(
        "Vui lòng nhập đầy đủ thông tin cho các mục chi lẻ trước khi thêm người khác."
      );
      return;
    }

    setPersonSplits((prevSplits) => {
      const newSplits = prevSplits.map((split) =>
        split.personId === personId
          ? { ...split, items: [...split.items, { name: "", amount: "" }] }
          : split
      );

      const updatedOptions = peopleOptions.filter(
        (option) =>
          !newSplits.some(
            (split) => split.personId === option.value && split.items.length > 0
          )
      );
      setPeopleOptions(updatedOptions);

      return newSplits;
    });
  };

  const handleRemoveSplitItem = (personId: string, index: number) => {
    setPersonSplits((prevSplits) => {
      const newSplits = prevSplits.map((split) =>
        split.personId === personId
          ? { ...split, items: split.items.filter((_, idx) => idx !== index) }
          : split
      );

      const updatedOptions = peoples
        .filter((people: IPeople) => !selectedPeopleIds.has(people.id))
        .map((people: IPeople) => ({
          value: people.id,
          label: people.name,
        }));
      setPeopleOptions(updatedOptions);
      return newSplits;
    });
  };

  const handleSplitItemChange = (
    personId: string,
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    setPersonSplits((prevSplits) =>
      prevSplits.map((split) =>
        split.personId === personId
          ? {
              ...split,
              items: split.items.map((item, idx) =>
                idx === index ? { ...item, [field]: value } : item
              ),
            }
          : split
      )
    );
  };

  const handleSelectChange = (selected: MultiValue<PersonOption>) => {
    const selectedIds = new Set(selected.map((option) => option.value));
    setSelectedPeopleIds(selectedIds);
    setSelectedPeople(selected);

    // Update people options to exclude selected users
    const updatedOptions = peoples
      .filter((people: IPeople) => !selectedIds.has(people.id))
      .map((people: IPeople) => ({
        value: people.id,
        label: people.name,
      }));
    setPeopleOptions(updatedOptions);

    // Remove selected people from personSplits
    setPersonSplits((prevSplits) =>
      prevSplits.filter((split) => !selectedIds.has(split.personId))
    );

    // Add unselected people back to personSplits with empty items
    const unselectedPeople = peoples.filter(
      (people: IPeople) => !selectedIds.has(people.id)
    );

    const newSplits = unselectedPeople.map((people) => ({
      personId: people.id,
      personName: people.name,
      items: [],
    }));

    setPersonSplits((prevSplits) => {
      const updatedSplits = prevSplits.slice(); // Make a copy of the current splits
      newSplits.forEach((newSplit) => {
        // Check if the person already exists in personSplits
        const existingSplitIndex = updatedSplits.findIndex(
          (split) => split.personId === newSplit.personId
        );

        if (existingSplitIndex === -1) {
          // Person does not exist, add new split
          updatedSplits.push(newSplit);
        }
      });

      return updatedSplits;
    });
  };

  useEffect(() => {
    // Filter out selected users from the peopleOptions
    const updatedOptions = peoples
      .filter((people: IPeople) => !selectedPeopleIds.has(people.id))
      .map((people: IPeople) => ({
        value: people.id,
        label: people.name,
      }));
    setPeopleOptions(updatedOptions);

    // Update personSplits to include unselected users
    const unselectedPeople = peoples.filter(
      (people: IPeople) => !selectedPeopleIds.has(people.id)
    );

    const newSplits = unselectedPeople.map((people) => ({
      personId: people.id,
      personName: people.name,
      items: [],
    }));

    setPersonSplits((prevSplits) => {
      const updatedSplits = prevSplits.slice(); // Make a copy of the current splits
      newSplits.forEach((newSplit) => {
        // Check if the person already exists in personSplits
        const existingSplitIndex = updatedSplits.findIndex(
          (split) => split.personId === newSplit.personId
        );

        if (existingSplitIndex === -1) {
          // Person does not exist, add new split
          updatedSplits.push(newSplit);
        }
      });

      return updatedSplits;
    });
  }, [peoples, selectedPeopleIds]);

  useEffect(() => {
    if (!isSplitEqually) {
      const initialSplits = peoples.map((people: IPeople) => ({
        personId: people.id,
        personName: people.name,
        items: [],
      }));
      setPersonSplits(initialSplits);
    } else {
      setPersonSplits([]);
    }
  }, [isSplitEqually, peoples]);

  const isFormValid = () => {
    const hasInvalidSplitItems = personSplits.some((split) =>
      split.items.some((item) => !item.name || !item.amount)
    );

    return (
      expenseName &&
      totalAmount &&
      expenseDate &&
      (isSplitEqually || !hasInvalidSplitItems)
    );
  };

  useEffect(() => {
    setIsSplitDisabled(checkSplitTotal());
  }, [personSplits, totalAmount]);

  useEffect(() => {
    setIsTotalExceeded(checkTotalExceeded());
  }, [personSplits, totalAmount]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Tính tiền chia sau buổi đi chơi
      </h1>
      {isTotalExceeded && (
        <p className="text-red-500 text-sm mt-2">
          Tổng số tiền chia lẻ lớn hơn tổng số tiền đã chi. Vui lòng điều chỉnh.
        </p>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Chọn phương thức chia tiền
        </label>
        <div className="flex items-center mt-2">
          <input
            type="radio"
            id="splitEqually"
            name="splitMethod"
            checked={isSplitEqually}
            onChange={() => setIsSplitEqually(true)}
            className="mr-2"
          />
          <label htmlFor="splitEqually" className="mr-4">
            Chia đều
          </label>
          <input
            type="radio"
            id="splitUnequally"
            name="splitMethod"
            checked={!isSplitEqually}
            onChange={() => setIsSplitEqually(false)}
            className="mr-2"
          />
          <label htmlFor="splitUnequally">Chia lẻ</label>
        </div>
      </div>
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
          onChange={handleSelectChange}
          placeholder="Chọn người tham gia..."
          isDisabled={isSplitDisabled} // Disable Select when split total equals total amount
        />
      </div>
      {!isSplitEqually && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Chia lẻ
          </label>
          {personSplits.map((personSplit) => (
            <div key={personSplit.personId} className="mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{personSplit.personName}</span>
                <button
                  onClick={() => handleAddSplitItem(personSplit.personId)}
                  className={`bg-blue-500 text-white px-2 py-1 rounded ${
                    isSplitDisabled
                      ? "!bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                  disabled={isSplitDisabled}
                >
                  Thêm
                </button>
              </div>
              {personSplit.items.map((item, index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleSplitItemChange(
                          personSplit.personId,
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Tên mục"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={item.amount}
                      onChange={(e) =>
                        handleSplitItemChange(
                          personSplit.personId,
                          index,
                          "amount",
                          handleCurrencyInput(e.target.value)
                        )
                      }
                      placeholder="Số tiền (VND)"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={() =>
                        handleRemoveSplitItem(personSplit.personId, index)
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
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
