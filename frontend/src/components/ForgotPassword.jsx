import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import login from "../assets/login.png";
import atIcon from "../assets/at.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://127.0.0.1:8088/api/user/generate-otp",
        { email }
      );

      // Go to OTP verification page
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-left">
        <img src={login} alt="forgot password" />
      </div>

      <div className="login-separator" />

      <div className="login-right">
        <h1 className="h">Forgot Password</h1>

        <p className="sub-textb">
          Please enter your email address below<br></br>you will receive a verification link.
        </p>

        <div className="input-group">
          <img src={atIcon} className="input-icon" alt="email" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="button"
          className="login-btn"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          {loading ? "Sending..." : "Continue"}
        </button>
      </div>
    </>
  );
}
