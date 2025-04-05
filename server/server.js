const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // adjust this to your frontend URL
  credentials: true               // 🔑 allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); // ✅ Enable reading cookies

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('API running'));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
