import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../services/firebase";

const findCountry = async ({ request }: any) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const usersQuery = query(collection(db, "users"));

  // Execute the query
  const querySnapshot = await getDocs(usersQuery);

  // Map through the query results and filter users whose names contain the substring
  const usersData = querySnapshot.docs
    .map((doc) => ({
      id: doc.id, // Get the document ID
      ...doc.data(), // Get the document data
    }))
    .filter(
      (user: any) =>
        user.name && user.name.toLowerCase().includes(name.toLowerCase())
    );

  return usersData;
};
export const expenseAction = async (request: any) => {
  const users = await findCountry(request);
  return users;
};
