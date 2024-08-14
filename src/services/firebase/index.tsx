import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATBFpa255YOHnXSeFsUeOn_h3lbJR6Yrc",
  authDomain: "fir-js-fc0aa.firebaseapp.com",
  projectId: "fir-js-fc0aa",
  storageBucket: "fir-js-fc0aa.appspot.com",
  messagingSenderId: "266360330821",
  appId: "1:266360330821:web:8b4265aacdbcf91905212c",
  measurementId: "G-6XPV1100TP",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

const provider = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
};
const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};

export { db, auth, provider, signInWithPopup, logOut };
