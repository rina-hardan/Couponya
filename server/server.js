import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // אם את מתכוונת להשתמש ב־req.body

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
