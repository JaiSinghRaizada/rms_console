import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import ProductGrid from "./ProductCard";
import Cart from "./Cart";
import "./dashboard.css";
import TopBar from "./TopBar";

export default function Dashboard() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <DashboardLayout>
      <TopBar />
  <div className="dashboard-content">
    <div className="dashboard-products">
      <ProductGrid addToCart={addToCart} />
    </div>
    <Cart cartItems={cartItems} />
  </div>
</DashboardLayout>

  );
}
