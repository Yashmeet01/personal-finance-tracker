import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function showMessage(text, error) {
    setMessage(text);
    setIsError(error);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      showMessage("Please fill all fields", true);
      return;
    }

    if (!isLogin && password.length < 6) {
      showMessage("Password must be at least 6 characters", true);
      return;
    }

    setLoading(true);

    const url = isLogin
      ? API + "/api/auth/login"
      : API + "/api/auth/signup";

    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message, true);
      } else if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        showMessage("Signup successful. Please log in.", false);
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      showMessage("Cannot reach the server", true);
    }

    setLoading(false);
  }

  return (
    <div className="auth-box">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>
        {message && (
          <p style={{ color: isError ? "red" : "green" }}>{message}</p>
        )}
      </form>

      <p></p>