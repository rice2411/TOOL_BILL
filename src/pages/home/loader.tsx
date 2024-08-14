import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return usersData;
};
export const homeLoader = async () => {
  const users = await fetchUsers();
  return users;
};
