import { useState } from "react";
import { menuApi } from "../../../api/menuApi";
import SuccessToast from "../../common/SuccessToast";
import "./menu.css";

export default function AddMenu({ onClose }) {
  const [menuName, setMenuName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const organizationId = localStorage.getItem("organizationId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menuName.trim()) {
      setError("Menu name is required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      menuName: menuName.trim(),
      organizationId,
    };

    if (siteId.trim()) payload.siteId = siteId.trim();

    try {
      await menuApi.add(payload);

      setSuccess("Menu added successfully 🎉");

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Add menu failed", err);
      setError("Failed to add menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessToast message={success} />

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

            <input
              type="text"
              placeholder="Site ID (optional)"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
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
    </>
  );
}
