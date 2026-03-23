import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";
import { userApi } from "../api/userApi";
import { jwtDecode } from "jwt-decode";
import { siteApi } from "../api/siteApi"; // ✅ FIXED
import login from "../assets/login.png";
import atIcon from "../assets/at.png";
import lockIcon from "../assets/lock.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await authApi.login({
      identifier: email.trim(),
      password,
    });

    localStorage.clear();

    const token = res.token;

    localStorage.setItem("token", token);
    localStorage.setItem("accessToken", token);

    // 🔎 Decode
    const decoded = jwtDecode(token);
    const userSub = decoded.sub;

    localStorage.setItem("userSub", userSub);

    // 👤 USER
    const user = await userApi.getByUserSub(userSub);
    console.log("User:", user);

    localStorage.setItem("userRole", user.role);

    // ✅ SAVE SITE
    if (user.siteId) {
      localStorage.setItem("siteId", user.siteId);

      // 🔥 FETCH SITE (CORRECT ENDPOINT NOW)
      const site = await siteApi.getById(user.siteId);

      console.log("Fetched Site:", site);

      if (site?.organizationId) {
        localStorage.setItem(
          "organizationId",
          site.organizationId
        );
      }
    }

    // ✅ NAVIGATE AFTER DATA READY
    navigate("/dashboard");

  } catch (err) {
    console.error(err);
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <img src={lockIcon} className="input-icon" alt="password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}
        <p className="forgot" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </p>

        <button
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

