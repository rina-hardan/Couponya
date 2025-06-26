import React, { useState } from 'react';
import { IconButton, ListItem, ListItemText, TextField, Box, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchFromServer } from "../api/ServerAPI";

export default function CartItem({ item, onRemove, onUpdate, userPoints, onUsePoints }) {
  const [usePoints, setUsePoints] = useState(false);
  const [newQuantity, setNewQuantity] = useState(item.quantity);

  const handleQuantityChange = async (event) => {
    const quantity = event.target.value;
    setNewQuantity(quantity);
    if (quantity >= 0) {
      onUpdate(item.coupon_id, quantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.coupon_id);
  };



  return (
    <ListItem>
      <ListItemText
        primary={item.title}  
        secondary={`Price: ${item.price_per_unit} ₪`}  
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          value={newQuantity}
          onChange={handleQuantityChange}
          type="number"
          sx={{ width: 60 }}
        />

        <IconButton onClick={handleRemove} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
}
