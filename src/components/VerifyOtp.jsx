import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await userApi.verifyOtp({ email, otp });

      // Go to reset password page
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(authErrorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-right">
        <h1 className="h">Verify OTP</h1>

        <div className="input-group">
          <input type="email" value={email} />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="login-btn"
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
