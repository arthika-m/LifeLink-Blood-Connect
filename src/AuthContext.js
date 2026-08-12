import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "./firebase";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  // Google Login
  const googleLogin = () => signInWithPopup(auth, provider);

  // Email Sign Up
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Email Login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Logout
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        googleLogin,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};