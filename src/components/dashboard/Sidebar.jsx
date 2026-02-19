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
        <NavLink to="/menu">
        <FileText />
        </NavLink>

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
