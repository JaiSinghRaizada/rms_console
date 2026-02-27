import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import Sites from "./components/dashboard/sites/Sites";
import Menu from "./components/dashboard/menu/Menu";
import Resetpass from "./components/Resetpass";
import VerifyOtp from "./components/VerifyOtp";
import MenuCategories from "./components/dashboard/menu/MenuCategories";
import MenuItems from "./components/dashboard/menu/MenuItems";
import Users from "./components/dashboard/user/Users";

import "./App.css";

const libraries = ["places"];

function App() {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
      libraries={libraries}
    >
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

          <Route
            path="/forgot-password"
            element={
              <div className="app">
                <ForgotPassword />
              </div>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <div className="app">
                <VerifyOtp />
              </div>
            }
          />

          <Route
            path="/reset-password"
            element={
              <div className="app">
                <Resetpass />
              </div>
            }
          />

          {/* Dashboard pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menus/:menuId" element={<MenuCategories />} />
          <Route path="/menu-items/:categoryId" element={<MenuItems />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;