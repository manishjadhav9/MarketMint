import express from 'express';
import prisma from '../config/db';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Create Product
router.post('/', authenticateToken, upload.array('images', 5), async (req: any, res) => {
  try {
    const { name, price, description } = req.body;
    const files = req.files as Express.Multer.File[];

    const product = await prisma.product.create({
      data: {
        user_id: req.user.id,
        name,
        price: parseFloat(price),
        description,
        category: req.body.category || 'Other',
        images: {
          create: files.map((file) => ({
            image_url: `/uploads/${file.filename}`,
          })),
        },
      },
      include: { images: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Get All Products
// Get All Products with Search & Filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const where: any = {};

    if (search) {
      where.name = { contains: search as string };
    }

    if (category && category !== 'All') {
      where.category = category as string;
    }

    const products = await prisma.product.findMany({
      where,
      include: { images: true, user: { select: { name: true, phone: true } } },
      orderBy: { created_at: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get My Products
router.get('/mine', authenticateToken, async (req: any, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { user_id: req.user.id },
      include: { images: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching my products' });
  }
});

// Get Single Product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { images: true, user: { select: { name: true, phone: true, email: true } } },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Delete Product
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
