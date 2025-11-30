'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductDetailsView from '@/components/ProductDetailsView';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link 
          href="/explore" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Explore
        </Link>

        <div className="max-w-6xl mx-auto">
          <ProductDetailsView productId={id} />
        </div>
      </div>
    </div>
  );
}
