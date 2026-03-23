import { useState } from "react";

// auto import all images
const images = import.meta.glob("../../assets/products/*", { eager: true });

// temporary product data
const productData = [
  { _id: 1, name: "Grill Sandwich", price: 120 },
  { _id: 2, name: "Pizza", price: 200 },
  { _id: 3, name: "Fries", price: 90 },
  { _id: 4, name: "Burger", price: 50 },
  { _id: 5, name: "Pasta", price: 150 },
];

export default function ProductGrid({ addToCart }) {
  const [products] = useState(productData);

  const getImage = (name) => {
  const fileName = name.toLowerCase().replace(/\s+/g, "_") + ".png";
  const path = `../../assets/products/${fileName}`;
  return images[path]?.default;
};

  return (
    <>
      <h2 className="section-title">Special Menu For You</h2>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">

            <img src={getImage(p.name)} alt={p.name} />

            <h4>{p.name}</h4>
            <p>₹{p.price}</p>

            <button onClick={() => addToCart(p)}>
              Add Product
            </button>

          </div>
        ))}
      </div>
    </>
  );
}