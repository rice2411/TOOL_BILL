import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

const fetchBill = async () => {
  // This simulates a network request delay
  const querySnapshot = await getDocs(collection(db, "bills"));
  const billData = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Lấy ID của tài liệu
    ...doc.data(), // Lấy dữ liệu của tài liệu
  }));
  return billData;
};
export const billLoader = async () => {
  const billData = await fetchBill();
  return billData;
};
