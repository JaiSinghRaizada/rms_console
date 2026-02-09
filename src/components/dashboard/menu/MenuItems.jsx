import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { menuItemApi } from "../../../api/menuItemApi";
import AddMenuItem from "./AddMenuItem";
import DashboardLayout from "../DashboardLayout";
import "./menu.css";

export default function MenuItems() {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const fetchItems = async () => {
    const data = await menuItemApi.getAll();
    setItems(data.filter(i => i.categoryId === categoryId));
  };

  useEffect(() => {
    fetchItems();
  }, [categoryId]);

  return (
    <DashboardLayout>
      {showAdd && (
        <AddMenuItem
          categoryId={categoryId}
          onSuccess={fetchItems}
          onClose={() => setShowAdd(false)}
        />
      )}

      <div className="page">
        <div className="page-header">
          <h2>Menu Items</h2>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Item
          </button>
        </div>

        <div className="menu-item-grid">
          {items.length === 0 ? (
            <p>No items added yet</p>
          ) : (
            items.map(item => (
              <div className="menu-item-card" key={item.itemId}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.itemName} />
                )}

                <div className="card-body">
                  <h4>{item.itemName}</h4>

                  {item.description && (
                    <p className="desc">{item.description}</p>
                  )}

                  <div className="card-footer">
                    <span className="price">₹{item.price}</span>

                    {item.dietaryInfo && (
                      <span className="diet">{item.dietaryInfo}</span>
                    )}

                    <span
                      className={
                        item.isAvailable ? "status active" : "status inactive"
                      }
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
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
