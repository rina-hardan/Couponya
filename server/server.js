import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from "../server/routers/usersRoute.js"
import couponsRouter from "../server/routers/couponRoute.js"
import orderRouter from "../server/routers/orderRoute.js"
import categoriesRouter from "../server/routers/categoriesRoute.js"
import regionsRouter from "../server/routers/regionsRoute.js"
import cartRouter from "../server/routers/cartRouter.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT||5000;



app.use(cors()); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const decodedDirname = decodeURIComponent(__dirname);

const uploadsStaticPath = path.join(decodedDirname, 'uploads');

app.use('/uploads', express.static(uploadsStaticPath));
app.use(express.json()); 

app.use("/users",usersRouter); 
app.use("/coupons",couponsRouter); 
app.use("/order",orderRouter); 
app.use("/categories",categoriesRouter); 
app.use("/regions",regionsRouter);
app.use("/cart",cartRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
