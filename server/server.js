import express from 'express';
import usersRouter from "../server/routers/usersRoute.js"
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use("/users",usersRouter); 
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
