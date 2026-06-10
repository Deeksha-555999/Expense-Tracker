import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch (err) {
      console.log(err);
      //alert(err.response?.data?.message);
    }
  };

  return (
    <div>

      <h2>Login Page</h2>
      <input
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
