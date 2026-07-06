import axios from "axios";
import "./styles/Auth.css";
import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password
        }
      );

      console.log("Response:", response.data);

      setMessage(response.data.message);

      if (response.data.message === "Login Successful") {

  localStorage.setItem(
    "token",
    response.data.token
  );

  onLogin(response.data.name);


      }

    } catch (error) {
      console.log(error);
    }
  }

return (
  <div className="auth-container">

    <div className="auth-card">

      <h1 className="auth-title">
        IntellMeet Login
      </h1>

      <label className="auth-label">
        Email Address
      </label>

      <input
        className="auth-input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="auth-label">
        Password
      </label>

      <input
        className="auth-input"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="auth-btn"
        onClick={handleLogin}
      >
        Login
      </button>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

    </div>

  </div>
);
}

export default Login;