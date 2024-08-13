import React, { useEffect, useState } from "react";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import {
  auth,
  db,
  googleProvider,
  logOut,
  signInWithPopup,
} from "./services/firebase";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/login";

const App = () => {
  const { user, loading }: any = useAuth();
  const [data, setData] = useState<DocumentData>([]);
  const handleLogin = async () => {
    if (user) return;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User info:", user);
      // Thực hiện các hành động sau khi đăng nhập thành công
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Xử lý lỗi đăng nhập
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const docsData = querySnapshot.docs.map((doc) => doc.data());
      setData(docsData);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!user) {
  //   return (
  //     <div>
  //       You need to log in to view this page.
  //       <br />
  //       <button onClick={handleLogin}>Sign in with Google</button>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* <h1>Firestore Data</h1>
      <ul>
        {data.map((item: DocumentData, index: number) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
      <div>{`You are logged in with ${user.email}`}</div>
      <br />
      {user ? <button onClick={logOut}>Log out</button> : <></>} */}
      <LoginPage />
    </div>
  );
};

export default App;
