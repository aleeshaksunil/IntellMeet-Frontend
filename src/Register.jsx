import { useState } from "react";
import axios from "axios";
import "./styles/Auth.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
const [passwordValid, setPasswordValid] = useState(false);

function validatePassword(value) {

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

  if (value.length === 0) {
    setPasswordMessage("");
    setPasswordValid(false);
    return;
  }

  if (regex.test(value)) {
    setPasswordMessage("✔ Strong Password");
    setPasswordValid(true);
  } else {
    setPasswordMessage(
      "Password must contain uppercase, lowercase, number, special character and be at least 8 characters."
    );
    setPasswordValid(false);
  }

}
  async function handleRegister() {

    // Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain:\n\n" +
        "✔ Minimum 8 characters\n" +
        "✔ One uppercase letter\n" +
        "✔ One lowercase letter\n" +
        "✔ One number\n" +
        "✔ One special character"
      );
      return;
    }

    try {

      const response = await axios.post(
        "https://intellmeet-backend-sdkg.onrender.com/register",
        {
          name,
          email,
          password
        }
      );

      alert(response.data.message);

      setName("");
setEmail("");
setPassword("");
setPasswordMessage("");
setPasswordValid(false);

    }

    catch (error) {

      console.log(error);

      alert("Registration Failed");

    }

  }

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          IntellMeet Register
        </h1>

        <label className="auth-label">
          Full Name
        </label>

        <input
          className="auth-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <label className="auth-label">
          Email Address
        </label>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <label className="auth-label">
          Password
        </label>

        <input
          className="auth-input"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => {
  setPassword(e.target.value);
  validatePassword(e.target.value);
}}
        />

        <p
  style={{
    marginTop: "8px",
    fontSize: "13px",
    color: passwordValid ? "green" : "#ef4444",
    lineHeight: "1.5",
    fontWeight: "500"
  }}
>
  {passwordMessage}
</p>

        <button
          className="auth-btn"
          onClick={handleRegister}
        >
          Register
        </button>

      </div>

    </div>

  );

}

export default Register;