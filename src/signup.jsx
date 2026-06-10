import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(0);

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/users", {
        username,
        password,
        saving,
      });

      alert("User created successfully");
      console.log(res.data);
      setUsername("");
      setPassword("");
      setSaving(0);
    } catch (err) {
      //console.log(err.response);
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup Page</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="number"
        placeholder="Initial Saving"
        value={saving}
        onChange={(e) => setSaving(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;
