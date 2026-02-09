import { useState } from "react";
import { menuItemApi } from "../../../api/menuItemApi";
import "./menu.css";

export default function AddMenuItem({ categoryId, onSuccess, onClose }) {
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    price: "",
    imageUrl: "",
    dietaryInfo: "",
    isAvailable: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.itemName || !form.price) {
      alert("Item Name and Price are required");
      return;
    }

    await menuItemApi.add({
      categoryId,
      itemName: form.itemName,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      dietaryInfo: form.dietaryInfo,
      isAvailable: form.isAvailable,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Menu Item</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="itemName"
            placeholder="Item Name *"
            value={form.itemName}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price *"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <input
            name="dietaryInfo"
            placeholder="Dietary Info (e.g. Vegetarian)"
            value={form.dietaryInfo}
            onChange={handleChange}
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Add Item
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
