import express from 'express';
import postRoutes from './routes/postRoutes.js';

const app = express();

app.use('/api/posts', postRoutes);

export default app;
