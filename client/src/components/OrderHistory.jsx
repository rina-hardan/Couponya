import { useEffect, useState } from "react";
import { fetchFromServer } from "../api/ServerAPI";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import "../css/OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [sort, setSort] = useState("order_date_desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  const fetchOrders = async (selectedSort, pageToFetch = 1) => {
    setLoading(true);
    try {
      const result = await fetchFromServer(`order/?sort=${selectedSort}&page=${pageToFetch}&limit=${limit}`);
      const newOrders = result.orders || [];

      if (pageToFetch === 1) {
        setOrders(newOrders);
      } else {
        setOrders((prev) => [...prev, ...newOrders]);
      }

      setHasMore(newOrders.length === limit);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(sort, 1);
  }, [sort]);

  // גלילה אוטומטית
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchOrders(sort, nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, sort]);

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

      {orders.length === 0 && !loading ? (
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

          {loading && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <CircularProgress />
            </div>
          )}

          {!hasMore && !loading && (
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "gray" }}>
              All orders loaded.
            </Typography>
          )}
        </div>
      )}
    </Container>
  );
}
