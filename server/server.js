import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import usersRouter from "../server/routers/usersRoute.js"
import couponsRouter from "../server/routers/couponRoute.js"
import orderRouter from "../server/routers/orderRoute.js"
import categoriesRouter from "../server/routers/categoriesRoute.js"
import regionsRouter from "../server/routers/regionsRoute.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT||5000;



app.use(cors()); 

app.use(express.json()); 
app.use("/users",usersRouter); 
app.use("/coupons",couponsRouter); 
app.use("/order",orderRouter); 
app.use("/categories",categoriesRouter); 
app.use("/regions",regionsRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
