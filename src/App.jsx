import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import Transaction from "./Transaction";

function App() {
  const [userData, setUserData] = useState(null);

  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getUserData(token);
    }
  }, []);

  const getUserData = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setUserData(res.data.updatedUser)
      setUserData(res.data);
    } catch {
      localStorage.removeItem("token");
      setUserData(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // setUserData(res.data.updatedUser)
    setUserData(null);
  };

  // USER NOT LOGGED IN

  if (!localStorage.getItem("token")) {
    return (
      <div>
        {showLogin ? <Login /> : <Signup />}

        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? "Create Account" : "Go to Login"}
        </button>
      </div>
    );
  }

  // USER LOGGED IN

  return (
    <div className="container">
      <h1>Expense-Tracker</h1>

      {userData ? (
        <div className="card">
          <h2>{userData.username}</h2>

          <h3>Saving: ₹{userData.saving}</h3>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <Transaction user={userData} setUserData={setUserData} />
    </div>
  );
}

export default App;
