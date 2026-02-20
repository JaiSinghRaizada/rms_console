import { useEffect, useState } from "react";
import { menuItemApi } from "../../../api/menuItemApi";
import AddMenuItem from "./AddMenuItem";
import DashboardLayout from "../DashboardLayout";
import { DeleteButton, Loader, SuccessToast } from "../../../common";
import "./menu.css";

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  /* ==========================
     FETCH ITEMS
  ========================== */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await menuItemApi.getAll();
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch items", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     DELETE ITEM
  ========================== */
  const handleDeleteItem = async (menuItemId) => {
    if (!menuItemId) return;

    try {
      await menuItemApi.delete(menuItemId);
      setSuccess("Item deleted successfully ✅");
      fetchItems();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <DashboardLayout>
      <SuccessToast message={success} />

      {showAdd && (
        <AddMenuItem
          onSuccess={fetchItems}
          onClose={() => setShowAdd(false)}
        />
      )}

      <div className="page">
        <div className="page-header">
          <h2>Menu Items</h2>

          <button
            className="btn-primary"
            onClick={() => setShowAdd(true)}
          >
            + Add Item
          </button>
        </div>

        <div className="menu-item-grid">
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <p>No items added yet</p>
          ) : (
            items.map((item) => (
              <div
                className="menu-item-card"
                key={item._id}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                  />
                )}

                <div className="card-body">
                  <h4>{item.itemName}</h4>

                  {item.description && (
                    <p className="desc">
                      {item.description}
                    </p>
                  )}

                  <div className="card-footer">
                    <span className="price">
                      ₹{item.price}
                    </span>

                    {item.dietaryInfo && (
                      <span className="diet">
                        {item.dietaryInfo}
                      </span>
                    )}

                    <span
                      className={
                        item.isAvailable
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {item.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    <DeleteButton
                      id={item._id}
                      onDelete={handleDeleteItem}
                      confirmMessage="Delete this item?"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}