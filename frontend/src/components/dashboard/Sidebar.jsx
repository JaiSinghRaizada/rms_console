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
      {/* Logo */}
      <div className="sidebar-logo">
        <h3>O</h3>
      </div>

      {/* Icons */}
      <nav className="sidebar-menu">
        <Home className="active" />
        <LayoutGrid />
        <FileText />
        <ShoppingBag />
        <Bell />
        <User />
        <Send />
        <Settings />
      </nav>
    </aside>
  );
}
