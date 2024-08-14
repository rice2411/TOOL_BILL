import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

const fetchBill = async () => {
  const querySnapshot = await getDocs(collection(db, "bills"));
  const billData = querySnapshot.docs.map((doc) => ({
    id: doc.id, 
    ...doc.data(),
  }));
  return billData;
};
export const billLoader = async () => {
  const billData = await fetchBill();
  return billData;
};
