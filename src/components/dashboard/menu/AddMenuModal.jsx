import { useState } from "react";
import { menuApi } from "../../../api/menuApi";
import { Modal, Input } from "../../../common";

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
    <Modal title="Add Menu">
      <Input
        placeholder="Menu name"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
      />

      <div className="modal-actions">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          className="btn-secondary"
          onClick={() => onClose(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
