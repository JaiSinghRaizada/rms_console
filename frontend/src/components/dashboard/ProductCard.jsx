import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductGrid({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h2 className="section-title">Special Menu For You</h2>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img src={`http://localhost:5000${p.image}`} alt={p.name} />
            <h4>{p.name}</h4>
            <p>${p.price}</p>

            <button onClick={() => addToCart(p)}>
              Add Product
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
