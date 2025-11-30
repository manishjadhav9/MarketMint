'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: { image_url: string }[];
  user: { name: string };
}

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Art', 'Collectibles', 'Music', 'Photography', 'Sports', 'Utility'];

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const response = await axios.get('http://localhost:4000/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header & Filters */}
        <div className="mb-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Explore <span className="text-primary">Marketplace</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover unique digital assets from creators around the world.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-5xl mx-auto glass p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items, collections, and accounts..."
                className="w-full bg-transparent border-none pl-10 focus:ring-0 placeholder:text-muted-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                suppressHydrationWarning
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    category === cat
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-card rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={product.images[0]?.image_url ? `http://localhost:4000${product.images[0].image_url}` : 'https://placehold.co/400'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">by {product.user?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Price</span>
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      </div>
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
