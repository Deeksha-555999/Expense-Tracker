import axios from "axios";
import { useState, useEffect } from "react";

function Transaction({ user, setUserData }) {

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("save");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // ADD TRANSACTION
const addTransaction = async () => {

  try {

    setError("");

    console.log("FRONTEND PAYLOAD:", {
      userId: user?._id,
      amount: Number(amount),
      type: type
    });

    // CHECK USER
    if (!user || !user._id) {
      setError("User not found");
      return;
    }

    // CHECK AMOUNT
    if (!amount) {
      setError("Please enter amount");
      return;
    }

    const res = await axios.post(
      "http://localhost:3000/api/transactions",
      {
        userId: user._id,
        amount: Number(amount),
        type,
      }
    );

    console.log(res.data);

    setUserData(res.data.updatedUser);

    setAmount("");

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

      {error && <p>{error}</p>}

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="save">Save</option>
        <option value="use">Use</option>
      </select>

      <button onClick={addTransaction}>
        Add
      </button>

      <hr />

      <h3>History</h3>

      {history.map((t) => (

        <div key={t._id}>

          <p>
            {t.type} - ₹{t.amount}
          </p>

          <p>
            Total Saving: ₹{t.savings}
          </p>

        </div>
      ))}

    </div>
  );
}

export default Transaction;