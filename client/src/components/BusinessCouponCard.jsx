import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BusinessCouponCard({ coupon, onEdit, onDelete }) {
  return (
    <Card sx={{ mb: 2, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{coupon.title}</Typography>
          <Typography color="text.secondary">{coupon.status}</Typography>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1 }}>{coupon.description}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Price: ₪{coupon.discounted_price} | Quantity: {coupon.quantity}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Purchases: {coupon.purchasedCount || 0}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => onEdit(coupon)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(coupon.id)}>
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
