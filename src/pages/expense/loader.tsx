import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

const fetchUsers = async () => {
  // This simulates a network request delay
  const querySnapshot = await getDocs(collection(db, "users"));
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Lấy ID của tài liệu
    ...doc.data(), // Lấy dữ liệu của tài liệu
  }));
  return usersData;
};
export const expenseLoader = async () => {
  const users = await fetchUsers();
  return users;
};
