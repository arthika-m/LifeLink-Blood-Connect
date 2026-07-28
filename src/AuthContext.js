import { createContext, useContext, useEffect, useState } from "react";

import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "./firebase";

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

  const signup = (email, password) =>

    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>

    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () =>

    signInWithPopup(auth, new GoogleAuthProvider());

  const logout = () =>

    signOut(auth);

  return (

    <AuthContext.Provider

      value={{

        user,

        signup,

        login,

        googleLogin,

        logout

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};