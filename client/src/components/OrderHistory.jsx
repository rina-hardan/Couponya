import { useEffect, useState } from "react";
import { fetchFromServer } from "../api/ServerAPI";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "../css/OrderHistory.css";
import { Alert, Container, Typography } from "@mui/material";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sort, setSort] = useState("order_date_desc");

  const fetchOrders = async (selectedSort) => {
    try {
      const result = await fetchFromServer(`order/?sort=${selectedSort}`, "GET");
      setOrders(result.orders || []);
      console.log("Orders fetched successfully:", result);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders(sort);
  }, [sort]);

  return (
    <Container className="order-history-page" maxWidth="md">
      <Typography variant="h4" gutterBottom>
        🛍️ My Order History
      </Typography>

      <FormControl fullWidth sx={{ maxWidth: 300, mb: 2 }}>
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          value={sort}
          label="Sort By"
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value="order_date_desc">Newest First</MenuItem>
          <MenuItem value="order_date_asc">Oldest First</MenuItem>
          <MenuItem value="total_price_desc">Most Expensive</MenuItem>
          <MenuItem value="total_price_asc">Least Expensive</MenuItem>
        </Select>
      </FormControl>

      {orders.length === 0 ? (
 <Typography variant="body1">🙁 No orders found.</Typography>      ) : (
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
