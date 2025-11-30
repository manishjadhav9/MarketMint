'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone, User, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Product {
  id: number;
  user_id: number;
  name: string;
  price: number;
  description: string;
  images: { image_url: string }[];
  user: {
    name: string;
    phone?: string;
    email?: string;
  };
}

export default function ProductCard({ product, onUpdate }: { product: Product; onUpdate?: () => void }) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.image_url || '/placeholder.png');
  const [isFavorite, setIsFavorite] = useState(false); // Ideally fetch this state

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/favorites/${product.id}`);
      setIsFavorite(data.isFavorite);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const deleteProduct = async () => {
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
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ y: -5 }}
          className="cursor-pointer"
        >
          <Card className="overflow-hidden border-none shadow-md transition-shadow hover:shadow-xl">
            <div className="aspect-square w-full overflow-hidden bg-gray-100">
              <img
                src={`http://localhost:4000${product.images[0]?.image_url}`}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/400')}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="truncate text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                </div>
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>Posted by {product.user.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`http://localhost:4000${selectedImage}`}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/400')}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    selectedImage === img.image_url ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={`http://localhost:4000${img.image_url}`}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400')}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900">Price</h4>
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Description</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-semibold text-gray-900">Seller Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{product.user.name}</span>
                </div>
                {product.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{product.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="flex-1" size="lg">
                Contact Seller
              </Button>
              {user?.id === product.user_id && (
                <Button variant="destructive" size="lg" onClick={deleteProduct}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
