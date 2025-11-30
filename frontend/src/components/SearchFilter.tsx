'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Other'];

interface SearchFilterProps {
  onSearch: (query: string, category: string) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearch = () => {
    onSearch(query, category);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            onClick={() => setCategory(cat)}
            className="whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
