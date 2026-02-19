import { useState } from "react";
import { menuCategoryApi } from "../../../api/menuCategoryApi";
import {
  Modal,
  Input,
  TextArea,
} from "../../../common";
import SuccessToast from "../../../common/SuccessToast";
import "./menu.css";

export default function AddMenuCategory({ menuId, onClose }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      setSuccess("Category added successfully ✅");

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessToast message={success} />

      <Modal title="Add Menu Category">
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <TextArea
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
      </Modal>
    </>
  );
}
