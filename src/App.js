import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import "./App.css";

function App() {
  // ==========================
  // FIREBASE AUTHENTICATION
  // ==========================

  const {
    user,
    signup,
    login,
    googleLogin,
    logout
  } = useAuth();

  // ==========================
  // AUTH0 AUTHENTICATION
  // ==========================

  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout
  } = useAuth0();

  // ==========================
  // AUTHENTICATION STATES
  // ==========================

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ==========================
  // DONOR DETAILS
  // ==========================

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [available, setAvailable] = useState("Yes");

  // ==========================
  // FIREBASE LOGIN / SIGNUP
  // ==========================

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      alert("Please enter Email and Password");
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        alert("Login Successful");
      } else {
        await signup(email, password);
        alert("Account Created Successfully");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // FIREBASE LOGOUT
  // ==========================

  const handleFirebaseLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // AUTH0 LOGIN
  // ==========================

  const handleAuth0Login = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // AUTH0 LOGOUT
  // ==========================

  const handleAuth0Logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  // ==========================
  // SAVE DONOR TO FIRESTORE
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
      // Determine which authentication system is being used
      const currentUser = user || auth0User;

      if (!currentUser) {
        alert("Please login first.");
        return;
      }

      await addDoc(collection(db, "donors"), {
        name: name,
        age: age,
        gender: gender,
        bloodGroup: bloodGroup,
        phone: phone,
        city: city,
        address: address,
        available: available,

        email: currentUser.email,

        // Firebase UID or Auth0 subject ID
        userId: currentUser.uid || currentUser.sub,

        authenticationProvider: user
          ? "Firebase"
          : "Auth0",

        createdAt: serverTimestamp()
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

    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // AUTH0 LOADING
  // ==========================

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // ==========================
  // AUTH0 USER LOGGED IN
  // ==========================

  if (isAuthenticated && auth0User && !user) {
    return (
      <div className="dashboard">

        <h1>🩸 LifeLink Blood Connect</h1>

        <p className="subtitle">
          Blood Donation & Emergency Request Matching Platform
        </p>

        <div className="user-info">

          {auth0User.picture && (
            <img
              src={auth0User.picture}
              alt="Profile"
              className="profile"
              width="100"
            />
          )}

          <h2>
            Welcome, {auth0User.name || "Auth0 User"}
          </h2>

          <p>{auth0User.email}</p>

          <p>
            <strong>Login Provider:</strong> Auth0
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={handleAuth0Logout}
        >
          Logout from Auth0
        </button>

        <hr />

        <h2>Blood Donor Registration</h2>

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
        />

        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
        >
          <option>Yes</option>
          <option>No</option>
        </select>

        <br />
        <br />

        <button
          className="register-btn"
          onClick={registerDonor}
        >
          Register as Donor
        </button>

      </div>
    );
  }

  // ==========================
  // FIREBASE USER LOGGED IN
  // ==========================

  if (user) {
    return (
      <div className="dashboard">

        <h1>🩸 LifeLink Blood Connect</h1>

        <p className="subtitle">
          Blood Donation & Emergency Request Matching Platform
        </p>

        <h2>
          Welcome, {user.displayName || "User"}
        </h2>

        <p>{user.email}</p>

        <p>
          <strong>Login Provider:</strong> Firebase
        </p>

        <button
          className="logout-btn"
          onClick={handleFirebaseLogout}
        >
          Logout
        </button>

        <hr />

        <h2>Blood Donor Registration</h2>

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
        />

        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
        >
          <option>Yes</option>
          <option>No</option>
        </select>

        <br />
        <br />

        <button
          className="register-btn"
          onClick={registerDonor}
        >
          Register as Donor
        </button>

      </div>
    );
  }

  // ==========================
  // LOGIN PAGE
  // ==========================

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

        {/* Firebase Google Login */}
        <button
          className="google-btn"
          onClick={googleLogin}
        >
          Continue with Google
        </button>

        {/* Auth0 Login */}
        <button
          className="auth0-btn"
          onClick={handleAuth0Login}
        >
          Login with Auth0
        </button>

      </div>

    </div>
  );
}

export default App;
