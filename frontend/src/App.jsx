import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import Resetpass from "./components/Resetpass";
import "./App.css";
import VerifyOtp from "./components/VerifyOtp";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Centered pages */}
        <Route
          path="/"
          element={
            <div className="app">
              <Login />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="app">
              <Signup />
            </div>
          }
        />
       <Route path="/forgot-password" element={
        <div className="app"><ForgotPassword /></div>
       } />
<Route path="/verify-otp" element={ <div className="app"><VerifyOtp /></div>} />
<Route path="/reset-password" element={<div className="app"><Resetpass /></div>} />


        {/* Full-width dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
