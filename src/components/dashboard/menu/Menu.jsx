import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch menu items
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/menu-service"); // adjust if query params needed
      const json = await res.json();
      setMenus(json.data ?? json);
    } catch (err) {
      console.error("Failed to fetch menu", err);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await fetch(`/menu-service/${id}`, { method: "DELETE" });
    fetchMenus();
  };

  return (
    <DashboardLayout>
      <div className="menu-page">
        {/* HEADER */}
        <div className="menu-header">
          <h2>Product</h2>
          <button className="btn-primary">+ Add Product</button>
        </div>

        {/* TABLE */}
        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Product ID</th>
                <th>Quality</th>
                <th>Price</th>
                <th align="right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No menu items found
                  </td>
                </tr>
              ) : (
                menus.map((item) => (
                  <tr key={item._id}>
                    {/* PRODUCT CELL */}
                    <td>
                      <div className="menu-product">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="menu-img"
                        />
                        <span className="menu-title">{item.name}</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className="badge-active">In Stock</span>
                    </td>

                    {/* PRODUCT ID */}
                    <td>{item.productId}</td>

                    {/* QUANTITY */}
                    <td>{item.quantity}</td>

                    {/* PRICE */}
                    <td>${item.price}</td>

                    {/* ACTIONS */}
                    <td align="right">
                      <div className="icon-actions">
                        <button className="icon-btn" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button
                          className="icon-btn danger"
                          title="Delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
