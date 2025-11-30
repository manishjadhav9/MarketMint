'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setFetching(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Favorites</h1>

        {fetching ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onUpdate={fetchFavorites} />
            ))}
          </div>
        )}

        {!fetching && products.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            You haven't added any favorites yet.
          </div>
        )}
      </main>
    </div>
  );
}
