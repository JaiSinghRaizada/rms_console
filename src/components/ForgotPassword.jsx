import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";

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
      await userApi.generateOtp({ email });

      // Go to OTP verification page
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(authErrorHandler(err));
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
