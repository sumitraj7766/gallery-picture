import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to verify token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Track download
router.post('/', authenticateToken, (req: any, res) => {
  const { imageURL } = req.body;
  const user_id = req.user.id;

  if (!imageURL) return res.status(400).json({ message: 'Image URL is required' });

  try {
    const stmt = db.prepare('INSERT INTO downloads (user_id, imageURL) VALUES (?, ?)');
    const info = stmt.run(user_id, imageURL);
    res.status(201).json({ message: 'Download tracked', id: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking download' });
  }
});

export default router;
