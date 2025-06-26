import { useEffect, useState } from "react";
import { fetchFromServer } from "../api/ServerAPI";
import "../css/OrderHistory.css";
import { Alert, Container, Typography } from "@mui/material";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await fetchFromServer("order/", "GET");
        setOrders(result.orders || []);
        console.log("Orders fetched successfully:", result);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setErrorMessage(error.message || "Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container className="order-history-page" maxWidth="md">
      <Typography variant="h4" gutterBottom>
        🛍️ My Order History
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {orders.length === 0 && !errorMessage ? (
        <Typography variant="body1">🙁 No orders found.</Typography>
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
    </Container>
  );
}
