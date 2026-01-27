import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  FileText,
  ShoppingBag,
  Bell,
  User,
  Send,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard"><Home /></NavLink>
        <NavLink to="/sites"><LayoutGrid /></NavLink>
        <NavLink to="/menu"><FileText /></NavLink>
        <ShoppingBag />
        <Bell />
        <User />
        <Send />
        <Settings />
      </nav>
    </aside>
  );
}
