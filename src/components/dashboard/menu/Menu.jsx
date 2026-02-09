import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";

import { menuApi } from "../../../api/menuApi";
import { siteApi } from "../../../api/siteApi";
import AddMenu from "./AddMenu";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [sitesMap, setSitesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();
  const organizationId = localStorage.getItem("organizationId");

  // ================================
  // FETCH MENUS + SITES
  // ================================
  const fetchData = async () => {
    if (!organizationId) return;

    setLoading(true);
    try {
      const [menusRes, sitesRes] = await Promise.all([
        menuApi.getAll(),
        siteApi.getAll(organizationId),
      ]);

      // Build siteId → siteName map
      const map = {};
      sitesRes.forEach((site) => {
        map[String(site.siteId)] = site.siteName;
      });

      setMenus(menusRes || []);
      setSitesMap(map);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizationId]);

  // ================================
  // DELETE MENU
  // ================================
  const handleDelete = async (menuId, e) => {
    e.stopPropagation(); // 🔑 prevent row click
    if (!menuId) return;
    if (!window.confirm("Delete this menu?")) return;

    try {
      await menuApi.delete(menuId);
      alert("Menu deleted successfully ✅");
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete menu");
    }
  };

  return (
    <DashboardLayout>
      <div className="menu-page">
        {/* HEADER */}
        <div className="menu-header">
          <h2>Menus</h2>
          <button
            className="btn-primary"
            onClick={() => setShowAdd(true)}
            disabled={!organizationId}
          >
            + Add Menu
          </button>
        </div>

        {/* TABLE */}
        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Site Name</th>
                <th>Menu Name</th>
                <th>Status</th>
                <th align="right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No menu items found
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr
                    key={menu.menuId} // ✅ UNIQUE KEY
                    className="clickable-row"
                    onClick={() =>
                      navigate(`/menus/${menu.menuId}`)
                    }
                  >
                    <td>
                      {sitesMap[String(menu.siteId)] || "NA"}
                    </td>

                    <td>{menu.menuName}</td>

                    <td>
                      <span className="badge-active">Active</span>
                    </td>

                    <td align="right">
                      <button
                        className="icon-btn danger"
                        title="Delete Menu"
                        onClick={(e) =>
                          handleDelete(menu.menuId, e)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ADD MENU MODAL */}
        {showAdd && (
          <AddMenu
            onClose={() => {
              setShowAdd(false);
              fetchData();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
