import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { LocationOn, LocalOffer } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CouponCard = ({ coupon }) => {
console.log(import.meta.env.VITE_API_BASE_URL);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/CustomerHome/coupon/${coupon.id}`, { state: { coupon } });
  };

  return (
    <Card sx={{ width: 320, borderRadius: 3, boxShadow: 4, overflow: "hidden", m: 2 }}>
      <CardMedia
        component="img"
        height="180"
        image={coupon.logo_url ? `${BASE_URL}${coupon.logo_url}` : "/default_logo.png"}
        alt="Business logo"
      />
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight={600}>
          {coupon.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {coupon.business_name}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
          <LocalOffer fontSize="small" />
          <Typography variant="body2">החל מ־{coupon.discounted_price} ₪</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <LocationOn fontSize="small" />
          <Typography variant="body2">{coupon.address}</Typography>
        </Box>
        <Button fullWidth variant="contained" onClick={handleClick}>
          לפרטים ורכישה
        </Button>
      </CardContent>
    </Card>
  );
};

export default CouponCard;
