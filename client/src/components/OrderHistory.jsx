import { useEffect, useState } from "react";
import { fetchFromServer } from "../api/ServerAPI";
import "../css/OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await fetchFromServer("order/", "GET");
        setOrders(result.orders || []);
        console.log("Orders fetched successfully:", result);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-page">
      <h2>🛍️ My Order History</h2>
      {orders.length === 0 ? (
        <p>🙁 No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div className="order-card" key={index}>
              <h3>🧾 Order #{order.id}</h3>

              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Coupon ID</th>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Price per Unit</th>
                    <th>Item Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.coupon_id}</td>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>₪{item.price_per_unit}</td>
                      <td>₪{item.item_total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="order-date">
                📅 <strong>Order Date:</strong>{" "}
                {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p className="order-total">
                💳 <strong>Total Paid:</strong> ₪{order.total_price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
