import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey:"AIzaSyBkWGOK3-EKTdk8V7iYGMWtevt6_IbihY0",

  authDomain:"lifelink-blood-connect.firebaseapp.com",

  projectId:"lifelink-blood-connect",

  storageBucket:"lifelink-blood-connect.firebasestorage.app",

  messagingSenderId:"13678634697",

  appId:"1:13678634697:web:902206b6050da49c4c4f18"

};

const app=initializeApp(firebaseConfig);

export const auth=getAuth(app);

export const provider=new GoogleAuthProvider();

export const db=getFirestore(app);