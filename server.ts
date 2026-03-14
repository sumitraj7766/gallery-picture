import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoutes from './server/routes/auth.js';
import favoritesRoutes from './server/routes/favorites.js';
import downloadRoutes from './server/routes/download.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/download', downloadRoutes);

  // Pixabay Proxy (to keep API key secret)
  app.get('/api/images/search', async (req, res) => {
    const { q } = req.query;
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    
    if (!PIXABAY_API_KEY) {
      return res.status(500).json({ message: 'Pixabay API key not configured' });
    }

    try {
      const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(q as string)}&image_type=photo&pretty=true`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching from Pixabay' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
