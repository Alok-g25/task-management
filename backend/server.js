require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoute');
const cookieParser = require('cookie-parser');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
  })
)
app.use(express.json());
app.use(cookieParser())

app.get('/', (req, res) => res.send("server running"));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
