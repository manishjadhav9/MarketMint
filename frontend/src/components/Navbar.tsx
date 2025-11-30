'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag, LogOut, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <ShoppingBag className="h-6 w-6" />
          <span>MarketMint</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-gray-600 sm:inline-block">
                Hello, {user.name}
              </span>
              <Link href="/favorites">
                <Button variant="ghost" className="gap-2">
                  Favorites
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="default" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Sell
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                <LogOut className="h-5 w-5 text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
