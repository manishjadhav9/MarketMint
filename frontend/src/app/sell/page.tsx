'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Upload, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Other'];

export default function SellPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Other',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const { data } = await api.get('/products/mine');
      setMyProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      return toast.error('Please upload at least one image');
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product listed successfully!');
      setFormData({ name: '', price: '', description: '', category: 'Other' });
      setImages([]);
      setPreviews([]);
      fetchMyProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to list product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Sell Your Item</h1>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                          <img src={src} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-red-500 hover:bg-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50">
                        <Upload className="mb-2 h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Listing...' : 'List Item'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Your Listings</h2>
              {myProducts.length === 0 ? (
                <p className="text-gray-500">You haven't listed any items yet.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {myProducts.map((product) => (
                    <ProductCard key={product.id} product={{ ...product, user: user! }} onUpdate={fetchMyProducts} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
