const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection (using your existing database)
mongoose.connect('mongodb://127.0.0.1:27017/todoDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ THIS IS THE MISSING ROUTE
app.use('/api/todos', require('./routes/todoRoutes'));

app.get('/', (req, res) => {
  res.send('To-Do API is running');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));