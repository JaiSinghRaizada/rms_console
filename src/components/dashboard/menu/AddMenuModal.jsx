import { useState } from "react";
import { menuApi } from "../../../api/menuApi";

export default function AddMenuModal({ organizationId, onClose }) {
  const [menuName, setMenuName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!menuName || !organizationId) return;

    setLoading(true);
    try {
      await menuApi.addMenu({
        menuName,
        organizationId,
      });
      onClose(true);
    } catch (err) {
      console.error("Add menu failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>Add Menu</h3>

      <input
        placeholder="Menu name"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
      />

      <div className="modal-actions">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button onClick={() => onClose(false)}>Cancel</button>
      </div>
    </div>
  );
}
