import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes.js';

const app = express();

// CORS Middleware & JSON Body Parsing
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'StudyGen AI API',
    architecture: 'modular-src',
    timestamp: new Date().toISOString(),
  });
});

// Central API Routes
app.use('/api', apiRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('StudyGen AI Modular Backend Service Running...');
});

export default app;
