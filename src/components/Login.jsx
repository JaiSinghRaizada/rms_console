import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";
import { userApi } from "../api/userApi";
import { jwtDecode } from "jwt-decode";
import { organizationApi } from "../api/organizationApi";
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
  // Login Handler
  // -------------------------
const handleLogin = async () => {
  setLoading(true);
  setError("");

  try {
    // 🔐 LOGIN
    const res = await authApi.login({
      identifier: email.trim(),
      password,
    });

    localStorage.clear();

    // ✅ TOKEN
    const token = res.token;
    localStorage.setItem("token", token);
    localStorage.setItem("accessToken", token);

    // 🔎 DECODE TOKEN → USERNAME
    const decoded = jwtDecode(token);
    const userSub = decoded.sub;
    localStorage.setItem("userSub", userSub);

    // 👤 FETCH USER
    const user = await userApi.getByUserSub(userSub);
    console.log("User object:", user);

    localStorage.setItem("userRole", user.role);
    navigate("/dashboard");


    // 🏢 FETCH ORGANIZATION
const siteRes = await organizationApi.getSiteById(user.siteId);
console.log("Site response:", siteRes);

// handle array response
const site = Array.isArray(siteRes) ? siteRes[0] : siteRes;

if (site?.organizationId) {
  localStorage.setItem("organizationId", site.organizationId);
} else {
  console.warn("No organizationId found");
}
    console.log("Organization response:", orgRes);

    // Depending on backend structure
    let orgId = null;

    if (Array.isArray(orgRes) && orgRes.length > 0) {
      orgId = orgRes[0].organizationId;
    } else if (orgRes?.organizationId) {
      orgId = orgRes.organizationId;
    }

    if (orgId) {
      localStorage.setItem("organizationId", orgId);
    } else {
      console.warn("No organizationId found");
    }

    
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
