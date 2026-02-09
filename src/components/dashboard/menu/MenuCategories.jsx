import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";
import { useNavigate } from "react-router-dom";

import { menuCategoryApi } from "../../../api/menuCategoryApi";
import AddMenuCategory from "./AddMenuCategory";

export default function MenuCategories() {
  const { menuId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();


  const fetchCategories = async () => {
    if (!menuId) return;

    setLoading(true);
    try {
      const res = await menuCategoryApi.getAll();
      const filtered = res.filter((c) => c.menuId === menuId);
      setCategories(filtered);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [menuId]);

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await menuCategoryApi.delete(categoryId);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="menu-page">
        <div className="menu-header">
          <h2>Menu Categories</h2>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Category
          </button>
        </div>

        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th align="right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3">Loading...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-state">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.categoryId}>
                    <td>{c.categoryName}</td>
                    <td>{c.description}</td>
     <td align="right">
  <div className="action-btn-group">
    <button
      className="icon-btn"
      onClick={() => navigate(`/menu-items/${c.categoryId}`)}
      title="Add / View Items"
    >
      +
    </button>

    <button
      className="icon-btn danger"
      onClick={() => handleDelete(c.categoryId)}
      title="Delete Category"
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

        {showAdd && (
          <AddMenuCategory
            menuId={menuId}
            onClose={() => {
              setShowAdd(false);
              fetchCategories();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
