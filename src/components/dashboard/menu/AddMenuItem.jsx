import { useEffect, useState } from "react";
import { menuItemApi } from "../../../api/menuItemApi";
import { menuCategoryApi } from "../../../api/menuCategoryApi";
import {
  Modal,
  Input,
  TextArea,
  Checkbox,
  Select,
} from "../../../common";
import "./menu.css";

export default function AddMenuItem({
  menuId,
  onSuccess,
  onClose,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    price: "",
    imageUrl: "",
    dietaryInfo: "",
    isAvailable: true,
  });

  // ✅ Fetch categories for this menu
  useEffect(() => {
    const fetchCategories = async () => {
      if (!menuId) return;

      try {
        const data =
          await menuCategoryApi.getByMenuId(menuId);
        setCategories(data || []);
      } catch (err) {
        console.error(
          "Failed to fetch categories",
          err
        );
        setCategories([]);
      }
    };

    fetchCategories();
  }, [menuId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      alert("Please select a category");
      return;
    }

    if (!form.itemName || !form.price) {
      alert("Item Name and Price are required");
      return;
    }

    await menuItemApi.add({
      categoryId: selectedCategoryId, // ✅ FIXED
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
    <Modal title="Add Menu Item">
      <form onSubmit={handleSubmit}>

        {/* ✅ Category Dropdown */}
        <Select
          value={selectedCategoryId}
          onChange={(e) =>
            setSelectedCategoryId(e.target.value)
          }
          placeholder="Select Category"
          options={categories.map((cat) => ({
            value: cat.categoryId,
            label: cat.categoryName,
          }))}
        />

        <Input
          name="itemName"
          placeholder="Item Name *"
          value={form.itemName}
          onChange={handleChange}
          required
        />

        <TextArea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <Input
          name="price"
          type="number"
          placeholder="Price *"
          value={form.price}
          onChange={handleChange}
          required
        />

        <Input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <Input
          name="dietaryInfo"
          placeholder="Dietary Info (e.g. Vegetarian)"
          value={form.dietaryInfo}
          onChange={handleChange}
        />

        <Checkbox
          name="isAvailable"
          checked={form.isAvailable}
          onChange={handleChange}
          label="Available"
        />

        <div className="modal-actions">
          <button type="submit" className="btn-primary">
            Add Item
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
  );
}
