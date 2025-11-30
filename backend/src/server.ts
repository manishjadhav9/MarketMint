import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorites', require('./routes/favorites').default);

// Health Check
app.get('/', (req, res) => {
  res.send('MarketMint API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
