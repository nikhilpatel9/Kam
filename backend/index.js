import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routers/user.route.js';
import leadRoutes from './routers/lead.route.js';
import orderRoutes from './routers/order.route.js';
import contactRoutes from './routers/contact.route.js';
import authRoutes from './routers/auth.route.js';
import countRoutes from './routers/count.route.js';
import { setupSSE } from './controllers/count.controller.js';
import cookieParser from 'cookie-parser';
import path from 'path';


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', countRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/count;', countRoutes);
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});


app.get('/api/admin/count-updates', setupSSE);
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});