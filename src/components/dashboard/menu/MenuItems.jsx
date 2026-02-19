import { useEffect, useState } from "react";
import { menuItemApi } from "../../../api/menuItemApi";
import AddMenuItem from "./AddMenuItem";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";
import { DeleteButton } from "../../../common";

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await menuItemApi.getAll();
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (menuItemId) => {
    if (!menuItemId) return;
    await menuItemApi.delete(menuItemId);
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <DashboardLayout>
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
            <p>Loading...</p>
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
