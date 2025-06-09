import express from 'express';
import dotenv from 'dotenv';

import usersRouter from "../server/routers/usersRoute.js"
import couponsRouter from "../server/routers/couponRoute.js"
import orderRouter from "../server/routers/orderRoute.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use("/users",usersRouter); 
app.use("/coupons",couponsRouter); 
app.use("/order",orderRouter); 
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
