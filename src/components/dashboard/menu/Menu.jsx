import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";

import { menuApi } from "../../../api/menuApi";
import AddMenu from "./AddMenu";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const organizationId = localStorage.getItem("organizationId");

  const fetchMenus = async () => {
    if (!organizationId) return;

    setLoading(true);
    try {
      const allMenus = await menuApi.getAll();

      const filtered = allMenus.filter(
        (m) => m.organizationId === organizationId
      );

      setMenus(filtered);
    } catch (err) {
      console.error("Failed to fetch menu", err);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [organizationId]);

  const handleDelete = async (menuId) => {
    if (!menuId) return;
    if (!window.confirm("Delete this menu?")) return;

    try {
      await menuApi.delete(menuId);
      fetchMenus();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="menu-page">
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

        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Menu</th>
                <th>Status</th>
                <th>ID</th>
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
                menus.map((m) => (
                  <tr key={m.menuId}>
                    <td>{m.menuName}</td>
                    <td>
                      <span className="badge-active">Active</span>
                    </td>
                    <td>{m.menuId}</td>
                    <td align="right">
                      <button
                        className="icon-btn danger"
                        onClick={() =>
                          handleDelete(m.menuId)
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

        {showAdd && (
          <AddMenu
            onClose={() => {
              setShowAdd(false);
              fetchMenus();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
