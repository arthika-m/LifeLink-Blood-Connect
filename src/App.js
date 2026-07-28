import { useState } from "react";
import "./App.css";

import { useAuth } from "./AuthContext";

import dbx from "./dropbox";

import { db } from "./firebase";

import {

  collection,

  addDoc,

  serverTimestamp,

} from "firebase/firestore";

function App() {

  const {

    user,

    signup,

    login,

    googleLogin,

    logout,

  } = useAuth();

  // Authentication States

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // Blood Donor Form States

  const [name, setName] = useState("");

  const [age, setAge] = useState("");

  const [gender, setGender] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");

  const [phone, setPhone] = useState("");

  const [city, setCity] = useState("");

  const [address, setAddress] = useState("");

  const [available, setAvailable] = useState("Yes");
  const [file,setFile]=useState(null);
  
    // ===========================
  // Login / Signup Function
  // ==========================

  const handleSubmit = async () => {

    if (email === "" || password === "") {

      alert("Please enter Email and Password");

      return;

    }

    try {

      if (isLogin) {

        await login(email, password);

        alert("Login Successful!");

      } else {

        await signup(email, password);

        alert("Account Created Successfully!");

      }

    } catch (error) {

      alert(error.message);

    }

  };


  // ==========================
  // Register Blood Donor
  // ==========================

  const registerDonor = async () => {

    if (
      name === "" ||
      age === "" ||
      gender === "" ||
      bloodGroup === "" ||
      phone === "" ||
      city === "" ||
      address === ""
    ) {

      alert("Please fill all fields.");

      return;

    }

    try {

  let filePath = "";

  // Upload the selected file to Dropbox
  if (file) {

    const response = await dbx.filesUpload({
      path: "/" + file.name,
      contents: file,
    });

    filePath = response.result.path_display;
  }

  // Save donor details to Firestore
  await addDoc(collection(db, "donors"), {

    name: name,
    age: age,
    gender: gender,
    bloodGroup: bloodGroup,
    phone: phone,
    city: city,
    address: address,
    available: available,
    email: user.email,
    userId: user.uid,
    file: filePath,
    createdAt: serverTimestamp(),

  });

  alert("Donor Registered Successfully!");

      // Clear Form

      setName("");

      setAge("");

      setGender("");

      setBloodGroup("");

      setPhone("");

      setCity("");

      setAddress("");

      setAvailable("Yes");

      setFile(null);

    } catch (error) {

      alert(error.message);

    }

  };
    // ==========================
  // If User NOT Logged In
  // ==========================

  if (!user) {

    return (

      <div className="container">

        <div className="card">

          <h1>🩸 LifeLink Blood Connect</h1>

          <p className="subtitle">
            Blood Donation & Emergency Request Matching Platform
          </p>

          <div className="tabs">

            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>

          </div>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="main-btn"
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          <div className="divider">

            <span>OR</span>

          </div>

          <button
            className="google-btn"
            onClick={googleLogin}
          >
            Continue with Google
          </button>

        </div>

      </div>

    );

  }
    // ==========================
  // Dashboard (After Login)
  // ==========================

  return (

    <div className="dashboard">

      <h1>🩸 LifeLink Blood Connect</h1>

      <p className="subtitle">

        Blood Donation & Emergency Request Matching Platform

      </p>

      <div className="user-info">

        <img
          src={user.photoURL || "https://via.placeholder.com/100"}
          alt="Profile"
          className="profile"
        />

        <h2>
          Welcome,
          {" "}
          {user.displayName || "Donor"}
        </h2>

        <p>{user.email}</p>

      </div>

      <hr />

      <h2>Blood Donor Registration Form</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <select
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
      >
        <option value="">Select Blood Group</option>
        <option>A+</option>
        <option>A-</option>
        <option>B+</option>
        <option>B-</option>
        <option>AB+</option>
        <option>AB-</option>
        <option>O+</option>
        <option>O-</option>
      </select>

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      ></textarea>

      <select
        value={available}
        onChange={(e) => setAvailable(e.target.value)}
      >
        <option>Yes</option>
        <option>No</option>
      </select>

      <input

type="file"

onChange={(e)=>setFile(e.target.files[0])}

/>

      <button
        className="register-btn"
        onClick={registerDonor}
      >
        Register as Donor
      </button>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

    </div>

  );

}

export default App;