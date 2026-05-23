/* eslint-disable @next/next/no-img-element */
'use client';

import '../style.css';
import React from 'react';
import { Link, NavigationMenu } from '../components';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu as MenuIcon, X, User } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { motion } from 'motion/react';
import type { Menu as MenuType } from '@/src/actions/base';

export const Layout: React.FC<{ children: React.ReactNode; menus: MenuType[] }> = ({ children, menus = [] }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-(--primary-light2) text-(--text-primary)">
      {/* Top Announcement Bar */}
      <div className="bg-(--primary) text-white text-xs py-2 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto">
          Free shipping on orders over $50
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" aria-label="Home" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-(--primary) rounded-lg flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="text-lg font-bold text-(--text-primary) hidden sm:block">My Store</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center flex-1 min-w-0 justify-center">
              <NavigationMenu variant="desktop" menus={menus} pathname={pathname} user={user} />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={user ? '/profile' : '/login'}
                aria-label={user ? 'Profile' : 'Login'}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{user ? user.firstName : 'Sign In'}</span>
              </Link>

              <button
                aria-label={`Shopping cart (${itemCount} items)`}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-(--primary) text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              <button
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={
          isMobileMenuOpen
            ? { opacity: 1, height: 'auto' }
            : { opacity: 0, height: 0 }
        }
        transition={{ duration: 0.2 }}
        className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
      >
        <NavigationMenu
          variant="mobile"
          menus={menus}
          pathname={pathname}
          user={user}
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
      </motion.div>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-(--primary) rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <span className="text-white font-bold">My Store</span>
              </div>
              <p className="text-sm leading-relaxed">
                Welcome to My Store. Discover amazing products at great prices.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Shop</h4>
              <div className="space-y-2 text-sm">
                {menus.slice(0, 4).map((m) => (
                  <Link key={m.id} href={`/category/${m.collection_id}`} className="block hover:text-white transition-colors">
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/contact" className="block hover:text-white transition-colors">Contact Us</Link>
                <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
                <Link href="/privacy-policy" className="block hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="block hover:text-white transition-colors">Terms &amp; Conditions</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Payment</h4>
              <div className="space-y-2 text-sm">
                <p>We accept:</p>
                <p className="text-xs">Visa, Mastercard, PayPal, Afterpay</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs">
            &copy; {new Date().getFullYear()} My Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
