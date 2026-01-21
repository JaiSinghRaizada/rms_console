import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ProductGrid from "./ProductCard";
import Cart from "./Cart";
import "./dashboard.css";

export default function Dashboard() {
  const [cartItems, setCartItems] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);

      if (existing) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-area">
        <TopBar />
        <ProductGrid addToCart={addToCart} />
      </div>

      <Cart cartItems={cartItems} />
    </div>
  );
}
