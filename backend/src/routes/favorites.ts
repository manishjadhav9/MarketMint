import express from 'express';
import prisma from '../config/db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Toggle Favorite
router.post('/:productId', authenticateToken, async (req: any, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.user.id;

    const existing = await prisma.favorite.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: {
          user_id: userId,
          product_id: productId,
        },
      });
      return res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling favorite' });
  }
});

// Get My Favorites
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: req.user.id },
      include: {
        product: {
          include: { images: true },
        },
      },
    });
    res.json(favorites.map(f => f.product));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

export default router;
