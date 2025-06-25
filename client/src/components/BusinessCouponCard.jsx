import { Card, CardContent, Typography, Button, Stack, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function BusinessCouponCard({ coupon, onEdit }) {
  const formattedDate = new Date(coupon.expiry_date).toLocaleDateString();

  return (
    <Card sx={{ mb: 2, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{coupon.title}</Typography>
          <Chip label={coupon.status} color={coupon.status === "confirmed" ? "success" : "warning"} />
        </Stack>

        <Typography variant="body2" sx={{ mt: 1 }}>{coupon.description}</Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          💰 Price: ₪{coupon.discounted_price} (Original: ₪{coupon.original_price})
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          📦 Quantity: {coupon.quantity} | 🛒 Purchases: {coupon.purchasedCount || 0}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          📅 Expiry Date: {formattedDate}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          📍 Address: {coupon.address}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          🔐 Code: {coupon.code}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }} color={coupon.is_active ? "green" : "error"}>
          {coupon.is_active ? (
            <><CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> Active</>
          ) : (
            <><CancelIcon fontSize="small" sx={{ mr: 0.5 }} /> Inactive</>
          )}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => onEdit(coupon)}
          >
            Edit
          </Button>
         
        </Stack>
      </CardContent>
    </Card>
  );
}
