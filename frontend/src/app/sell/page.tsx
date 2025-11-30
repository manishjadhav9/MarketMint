'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Sell Your <span className="text-primary">Digital Asset</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              List your item for sale and reach thousands of potential buyers.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Sell Form */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Product Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Abstract 3D Art"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background/50 border-white/10 focus:border-primary/50"
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="bg-background/50 border-white/10 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-background/50 border-white/10 focus:border-primary/50">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-[150px] bg-background/50 border-white/10 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-background/50 group">
                        <img src={src} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm hover:bg-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">Upload Image</span>
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
                <Button type="submit" className="w-full h-12 text-base font-medium shadow-lg shadow-primary/25" disabled={submitting}>
                  {submitting ? 'Listing...' : 'List Item For Sale'}
                </Button>
              </form>
            </div>

            {/* Your Listings Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
                {myProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't listed any items yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {myProducts.map((product) => (
                      <div key={product.id} className="flex gap-3 items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden shrink-0">
                          <img 
                            src={
                              product.images[0]?.image_url
                                ? product.images[0].image_url.startsWith('http')
                                  ? product.images[0].image_url
                                  : `http://localhost:4000${product.images[0].image_url}`
                                : 'https://placehold.co/100'
                            } 
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="glass-card rounded-2xl p-6 bg-primary/5 border-primary/10">
                <h3 className="font-semibold mb-2 text-primary">Selling Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                  <li>Upload high-quality images to attract more buyers.</li>
                  <li>Write a detailed description including features and condition.</li>
                  <li>Set a competitive price based on similar items.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
