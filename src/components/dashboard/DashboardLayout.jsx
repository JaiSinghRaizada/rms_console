import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-area">
        
        {children}
      </div>
    </div>
  );
}
