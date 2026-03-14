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

// Add to favorites
router.post('/add', authenticateToken, (req: any, res) => {
  const { imageURL, tags } = req.body;
  const user_id = req.user.id;

  if (!imageURL) return res.status(400).json({ message: 'Image URL is required' });

  try {
    const stmt = db.prepare('INSERT INTO favorites (user_id, imageURL, tags) VALUES (?, ?, ?)');
    const info = stmt.run(user_id, imageURL, tags);
    res.status(201).json({ message: 'Added to favorites', id: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Error saving favorite' });
  }
});

// Get favorites for a user
router.get('/:userId', authenticateToken, (req: any, res) => {
  const { userId } = req.params;
  
  // Ensure user can only see their own favorites
  if (parseInt(userId) !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const rows = db.prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Delete favorite
router.delete('/:id', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const stmt = db.prepare('DELETE FROM favorites WHERE id = ? AND user_id = ?');
    const info = stmt.run(id, user_id);
    if (info.changes === 0) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Deleted from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting favorite' });
  }
});

export default router;
