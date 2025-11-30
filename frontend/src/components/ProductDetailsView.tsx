'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: { image_url: string }[];
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ProductDetailsViewProps {
  productId: string;
  onClose?: () => void; // Optional callback for modal closing
}

export default function ProductDetailsView({ productId, onClose }: ProductDetailsViewProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      if (user) {
        checkIfFavorite(productId);
      }
    }
  }, [productId, user]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (id: string) => {
    try {
      const { data } = await api.get('/favorites');
      const isFav = data.some((p: any) => p.id === parseInt(id));
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      router.push('/auth/login');
      return;
    }

    try {
      const { data } = await api.post(`/favorites/${productId}`);
      setIsFavorite(data.isFavorite);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/products/${productId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square rounded-2xl overflow-hidden bg-muted relative glass-card border-0"
        >
          <img
            src={
              product.images[activeImage]?.image_url
                ? product.images[activeImage].image_url.startsWith('http')
                  ? product.images[activeImage].image_url
                  : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${product.images[activeImage].image_url}`
                : 'https://placehold.co/600'
            }
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className={`rounded-full backdrop-blur-md border-0 transition-colors ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-black/50 text-white hover:bg-black/70'}`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md border-0"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
        
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={
                    img.image_url.startsWith('http')
                      ? img.image_url
                      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${img.image_url}`
                  }
                  alt={`${product.name} ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Listed by <span className="text-foreground font-medium">{product.user.name}</span></span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button size="lg" className="w-full text-lg h-14 shadow-lg shadow-primary/25">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
            <Button size="lg" variant="outline" className="w-full text-lg h-14 border-primary/20 hover:bg-primary/5">
              Make Offer
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Description</h3>
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>{product.description}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              {product.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{product.user.name}</p>
              <p className="text-sm text-muted-foreground">Member since 2024</p>
            </div>
            <Button variant="ghost" className="ml-auto text-primary hover:text-primary/80 hover:bg-primary/10">
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
