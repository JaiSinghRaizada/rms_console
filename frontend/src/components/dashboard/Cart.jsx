export default function Cart({ cartItems }) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <aside className="cart">
      <h3>Order</h3>

      {cartItems.length === 0 && (
        <p>No items added</p>
      )}

      {cartItems.map((item) => (
        <div key={item._id} className="cart-item">
          <span>
            {item.name} x {item.qty}
          </span>
          <span>${item.price * item.qty}</span>
        </div>
      ))}

      <div className="summary">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax (5%): ${tax.toFixed(2)}</p>
        <h2>Total: ${total.toFixed(2)}</h2>
      </div>

      <button className="place-order">
        Place Order
      </button>
    </aside>
  );
}
