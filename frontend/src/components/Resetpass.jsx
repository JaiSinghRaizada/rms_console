import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import login from "../assets/login.png";
import lockIcon from "../assets/lock.png";

export default function Resetpass() {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from VerifyOtp page
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://127.0.0.1:8088/api/user/set-password",
        { email,
          passWord: password }
      );

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* LEFT */}
      <div className="login-left">
        <img src={login} alt="reset password" />
      </div>

      <div className="login-separator" />

      {/* RIGHT */}
      <div className="login-right">
        <h1 className="h">Reset Password</h1>

        <div className="input-group">
          <input
            type="email"
            value={email}
            disabled
          />
        </div>

        <div className="input-group">
          <img src={lockIcon} className="input-icon" />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <img src={lockIcon} className="input-icon" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="button"
          className="signup-btn"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </>
  );
}
