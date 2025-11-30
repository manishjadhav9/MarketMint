'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (search = '', category = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Discover Unique Items
          </h1>
          <p className="text-lg text-gray-600">
            Explore a curated collection of premium goods from our community.
          </p>
        </motion.div>

        <SearchFilter onSearch={fetchProducts} />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onUpdate={() => fetchProducts()} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No products found. Be the first to list something!
          </div>
        )}
      </main>

      <footer className="mt-20 border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MarketMint. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
