'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
            alt="Hero Background" 
            className="h-full w-full object-cover opacity-20 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl space-y-8"
          >
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
              Discover Digital <br />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              The premium marketplace for exclusive digital assets. Buy, sell, and collect unique items with confidence and style.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/explore">
                <Button size="lg" className="h-12 min-w-[160px] text-base shadow-lg shadow-primary/25">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline" className="h-12 min-w-[160px] border-primary/20 bg-background/50 text-base backdrop-blur-sm hover:bg-primary/10">
                  Start Selling
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Assets</h2>
              <p className="mt-2 text-muted-foreground">Curated selection of premium digital goods.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="hidden sm:flex">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Placeholder Cards */}
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1620641788421-7a1c342ea42e' : i === 2 ? '1633158829585-23ba8f7c8caf' : i === 3 ? '1618172193763-c511deb635ca' : '1642104704074-907c0698cbd9'}?q=80&w=800&auto=format&fit=crop`}
                    alt="Product" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Art
                    </span>
                    <span className="text-sm font-semibold text-foreground">$120.00</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Abstract Dimension #{i}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    A unique piece of digital art exploring the boundaries of form and color.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/explore">
              <Button variant="outline" className="w-full">View All Assets</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Redefining the <br />
                <span className="text-primary">Digital Marketplace</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                MarketMint is more than just a platform; it's a community of creators and collectors. We provide a seamless, secure, and visually stunning environment for trading high-quality digital assets.
              </p>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Trading</h3>
                    <p className="text-sm text-muted-foreground">Advanced protection for every transaction.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instant Delivery</h3>
                    <p className="text-sm text-muted-foreground">Get your assets immediately after purchase.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" 
                  alt="About Us" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
              </div>
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 rounded-2xl border border-white/10 bg-background/80 p-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.9/5</p>
                    <p className="text-sm text-muted-foreground">User Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
