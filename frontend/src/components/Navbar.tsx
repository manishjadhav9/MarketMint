'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag, LogOut, PlusCircle, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span>MarketMint</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/explore">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              Explore
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2 hidden sm:flex">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/favorites">
                <Button variant="ghost" className="gap-2 hidden sm:flex">
                  Favorites
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="default" className="gap-2 shadow-lg shadow-primary/20">
                  <PlusCircle className="h-4 w-4" />
                  Sell
                </Button>
              </Link>
              <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                 <span className="hidden text-sm font-medium text-muted-foreground sm:inline-block">
                  {user.name}
                </span>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="shadow-lg shadow-primary/20">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
