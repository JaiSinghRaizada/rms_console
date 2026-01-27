import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";

import login from "../assets/login.png";
import atIcon from "../assets/at.png";
import lockIcon from "../assets/lock.png";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!userName || !email || !password || !confirmPassword) {
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
      await authApi.admin({ userName, email, password });
      alert("Signup successful");
      navigate("/");
    } catch (err) {
      setError(authErrorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left Image */}
      <div className="login-left">
        <img src={login} alt="signup" />
      </div>
<div className="login-separator" />
      {/* Right Form */}
      <div className="login-right">
        <h1 className="h">Registration</h1>

        <div className="input-group">
          <img src={atIcon} className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <img src={atIcon} className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>



        {error && <p className="error">{error}</p>}
        <div className="by">By signing below, you agree to the <span className="c">Terms of use</span><br>
        </br>and <span className="c">Privacy Policy</span></div>

        <button
          type="button"
          className="signup-btn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="signup">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </>
  );
}
