import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebase";

const fetchExpenses = async () => {
  // This simulates a network request delay
  const querySnapshot = await getDocs(collection(db, "expenses"));
  const expensesData = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Lấy ID của tài liệu
    ...doc.data(), // Lấy dữ liệu của tài liệu
  }));
  return expensesData;
};
export const createBillLoader = async () => {
  const expensesData = await fetchExpenses();
  return expensesData;
};
