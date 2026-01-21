import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";

import login from "../assets/login.png";
import atIcon from "../assets/at.png";
import lockIcon from "../assets/lock.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Input Validation
  // -------------------------
  const validateInputs = () => {
    if (!email && !password) {
      return "Email and password are required.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    if (email.trim() !== email) {
      return "Please remove extra spaces from the email address.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8 || password.length > 64) {
      return "Password must be at least 8 characters long and not exceed 64 characters.";
    }

    const unsupportedChars = /[<>]/;
    if (unsupportedChars.test(email) || unsupportedChars.test(password)) {
      return "Your input contains unsupported characters.";
    }

    return null;
  };

  // -------------------------
  // Login Handler
  // -------------------------
  const handleLogin = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await authApi.login({
        identifier: email.trim(),
        password,
      });

      localStorage.setItem("token", res.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(authErrorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-left">
        <img src={login} alt="login" />
      </div>

      <div className="login-separator" />

      <div className="login-right">
        <h1 className="h">Welcome Back!</h1>

        <div className="input-group">
          <img src={atIcon} className="input-icon" alt="email" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>

        <div className="input-group">
          <img src={lockIcon} className="input-icon" alt="password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <p className="forgot" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </p>

        <button
          type="button"
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </>
  );
}
