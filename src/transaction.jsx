import axios from "axios";
import { useState, useEffect } from "react";

function Transaction({ user, setUserData }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("save");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // ✅ 1. HISTORY LOAD KARNE KA FUNCTION 
  const loadHistory = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/transactions/${user._id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  // ✅ 2. APP LOAD HOTE HI YA USER CHANGE HOTE HI HISTORY AUTOMATIC LOAD HOGI
  useEffect(() => {
    loadHistory();
  }, [user]);

  // ✅ 3. DATE KO SAHI FORMAT MEIN DIKHANE KA FUNCTION (e.g., "29 May 2026")
  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // ADD TRANSACTION
  const addTransaction = async () => {
    try {
      setError("");

      if (!user || !user._id) {
        setError("User not found");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      const res = await axios.post("http://localhost:3000/api/transactions", {
        userId: user._id,
        amount: Number(amount),
        type,
      });

      console.log(res.data);
      setUserData(res.data.updatedUser);
      setAmount("");

      // ✅ Re-load history immediately after adding
      loadHistory();
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  return (
    <div>
      <h2>Transactions</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="save">Save</option>
        <option value="use">Use</option>
      </select>

      <button onClick={addTransaction}>Add</button>

      <hr />

      <h3>History</h3>

      <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
        {history.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No transactions yet</p>
        ) : (
          history.map((t) => (
            <div
              key={t._id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "10px 5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <span style={{ fontSize: "0.85em", color: "#666", display: "block" }}>
                  {formatDate(t.createdAt || t.date)}
                </span>
                <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                  {t.type === "save" ? "🟢 Added" : "🔴 Used"}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontWeight: "bold", color: t.type === "save" ? "green" : "red" }}>
                  {t.type === "save" ? "+" : "-"} ₹{t.amount}
                </span>
                <span style={{ display: "block", fontSize: "0.8em", color: "#777" }}>
                  Balance: ₹{t.savings}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Transaction;