import express from 'express';
import { PrismaClient } from '@prisma/client';
import { upload } from '../lib/cloudinary';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create a product with images
router.post('/', authenticateToken, upload.array('images', 5), async (req: any, res: any) => {
  try {
    const { name, price, description, category } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const product = await prisma.product.create({
      data: {
        user_id: userId,
        name,
        price: parseFloat(price),
        description,
        category: category || 'Other',
        images: {
          create: (req.files as any[]).map((file) => ({
            image_url: file.path, // Cloudinary returns the full URL in file.path
          })),
        },
      },
      include: {
        images: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string } }, // Removed mode: 'insensitive' for SQLite compatibility if needed, but Postgres supports it. keeping simple for now.
        { description: { contains: search as string } },
      ];
    }

    if (category && category !== 'All') {
      where.category = category as string;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        user: {
          select: { name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get My Products
router.get('/mine', authenticateToken, async (req: any, res: any) => {
  try {
    const products = await prisma.product.findMany({
      where: { user_id: req.user.id },
      include: { images: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Fetch my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req: any, res: any) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        images: true,
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
