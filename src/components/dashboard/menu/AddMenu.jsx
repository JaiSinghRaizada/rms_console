import { useState } from "react";
import { menuApi } from "../../../api/menuApi";
import "./menu.css";

export default function AddMenu({ onClose }) {
  const [menuName, setMenuName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const organizationId = localStorage.getItem("organizationId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menuName.trim()) {
      setError("Menu name is required");
      return;
    }

    if (!organizationId) {
      setError("Organization not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await menuApi.add({
        menuName: menuName.trim(),
        organizationId, // 🔑 REQUIRED BY BACKEND
      });

      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to add menu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Menu</h3>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Menu Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Menu"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
