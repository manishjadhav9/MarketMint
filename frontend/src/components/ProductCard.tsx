'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
  id: number;
  user_id: number;
  name: string;
  price: number;
  description: string;
  images: { image_url: string }[];
  user?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

export default function ProductCard({ product, onUpdate }: { product: Product; onUpdate?: () => void }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(true); // Since this is favorites page, it starts as true

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.post(`/favorites/${product.id}`);
      setIsFavorite(data.isFavorite);
      toast.success(data.message);
      if (onUpdate) onUpdate(); // Refresh list if removed
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const deleteProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${product.id}`);
      toast.success('Product deleted');
      if (onUpdate) onUpdate();
      else window.location.reload();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="cursor-pointer group"
    >
      <Link href={`/products/${product.id}`}>
        <Card className="overflow-hidden border-none shadow-md transition-shadow hover:shadow-xl glass-card">
          <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
            <img
              src={
                product.images[0]?.image_url
                  ? product.images[0].image_url.startsWith('http')
                    ? product.images[0].image_url
                    : `http://localhost:4000${product.images[0].image_url}`
                  : 'https://placehold.co/400'
              }
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/400')}
            />
            {/* Overlay Actions */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {user?.id === product.user_id && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={deleteProduct}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="truncate text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">by {product.user?.name || 'Unknown'}</p>
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
