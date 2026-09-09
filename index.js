require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api', generalLimiter); 


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));


app.use('/api', userRoutes);
app.use('/api', vaultRoutes);


app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then((db) => {
    app.locals.db = db;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });