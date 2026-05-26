const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const recordRoutes = require('./routes/record.routes');
const delayMiddleware = require('./middleware/delay');

const app = express();
const PORT = process.env.PORT || 3000;

// Logging HTTP requests
app.use(morgan('dev'));

// Enable CORS for frontend running on localhost ports dynamically
app.use(cors({
  origin: [
    'http://localhost:4205',
    'https://suam-portal.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Proactively handle OPTIONS preflight requests before delay
app.options('*', cors());

// Apply async delay middleware ONLY to API requests
app.use('/api', delayMiddleware);

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

// Root path diagnostic
app.get('/', (req, res) => {
  res.json({ message: 'SUAM Backend Server is running.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(` SUAM BACKEND RUNNING ON http://localhost:${PORT}`);
  console.log(` Async API Delay Simulator Active (1.5s to 3s)`);
  console.log(`===========================================================`);
});
