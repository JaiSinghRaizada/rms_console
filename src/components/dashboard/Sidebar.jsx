import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  LayoutGrid,
  FileText,
  ShoppingBag,
  Bell,
  User,
  Send,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"></div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard">
          <Home />
        </NavLink>

        <NavLink to="/sites">
          <LayoutGrid />
        </NavLink>

        {/* ✅ MENU DROPDOWN STARTS HERE */}
        <div className="sidebar-dropdown">
          <div
            className="sidebar-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FileText />
            
          </div>

          {menuOpen && (
            <div className="dropdown-menu">
              <NavLink to="/menu" className="dropdown-item">
                Menu
              </NavLink>

              <NavLink to="/menus/1" className="dropdown-item">
                Menu Category
              </NavLink>

              <NavLink to="/menu-items/1" className="dropdown-item">
                Menu Item
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/users">
          <User />
        </NavLink>

        <ShoppingBag />
        <Bell />
        <Send />
        <Settings />
      </nav>
    </aside>
  );
}
