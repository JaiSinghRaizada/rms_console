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
        <NavLink to="/dashboard" className="icon-btn">
          <Home />
        </NavLink>

        <NavLink to="/sites" className="icon-btn">
          <LayoutGrid />
        </NavLink>

        {/* ✅ MENU DROPDOWN STARTS HERE */}
        <NavLink to="/menu" className="icon-btn">
        <FileText />
        </NavLink>

        <NavLink to="/users" className="icon-btn">
          <User />
        </NavLink>

        <ShoppingBag />
        <NavLink to="/schedule" className="icon-btn">
  <Bell />
</NavLink>
        <Send />
        <Settings />
      </nav>
    </aside>
  );
}
