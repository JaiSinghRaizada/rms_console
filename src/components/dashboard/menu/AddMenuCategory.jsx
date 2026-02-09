import { useState } from "react";
import "./menu.css";
import { menuCategoryApi } from "../../../api/menuCategoryApi";

export default function AddMenuCategory({ menuId, onClose }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await menuCategoryApi.add({
        categoryName,
        description,
        menuId,
      });

      alert("Category added successfully ✅");
      onClose();
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Menu Category</h3>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <textarea
            className="menu-textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-actions">
            <button className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Create Category"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
