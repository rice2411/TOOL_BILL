import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

const fetchExpenses = async () => {
  const querySnapshot = await getDocs(collection(db, "expenses"));
  const expensesData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return expensesData;
};
export const invoiceLoader = async () => {
  const expensesData = await fetchExpenses();
  return expensesData;
};
