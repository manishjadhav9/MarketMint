'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  DollarSign, 
  Settings, 
  LogOut,
  Package,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Please log in to view your dashboard</h2>
          <Link href="/auth/login">
            <Button className="mt-4">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Sales', value: '$1,234', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Listings', value: '12', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Favorites', value: '45', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Purchases', value: '8', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </Button>
            <Button variant="destructive" className="gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card col-span-2 rounded-xl p-6"
          >
            <h2 className="mb-6 text-xl font-semibold">Recent Activity</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">New listing created</p>
                    <p className="text-sm text-muted-foreground">You listed "Neon Genesis #00{i}" for sale.</p>
                    <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="mb-6 text-xl font-semibold">Profile</h2>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt="Avatar" 
                  className="h-full w-full bg-background"
                />
              </div>
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              
              <div className="mt-6 w-full space-y-2">
                <Button className="w-full" variant="outline">Edit Profile</Button>
                <Button className="w-full" variant="ghost">View Public Profile</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
