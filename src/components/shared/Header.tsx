'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { SearchBar } from './SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CartIcon } from '@/components/cart/CartIcon';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Menu, X, Search } from 'lucide-react';

export function Header() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm position-sticky top-0 z-50" >
      <div className="w-full px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              E-Shop
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden flex-1 px-8 md:block">
            <Suspense fallback={<div className="h-10" />}> 
              <SearchBar />
            </Suspense>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 lg:gap-4 md:flex">
            <CartIcon onClick={() => setIsCartOpen(true)} />
            
            <Link
              href="/"
              className="px-2 py-1 text-sm lg:text-base text-gray-700 transition-colors hover:text-blue-600"
            >
              Home
            </Link>
            
            {isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className="px-2 py-1 text-sm lg:text-base text-gray-700 transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className="px-2 py-1 text-sm lg:text-base text-gray-700 transition-colors hover:text-blue-600"
                >
                  Admin
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="hidden sm:block text-xs lg:text-sm text-gray-600">
                  {user?.name} {isAdmin && '(Admin)'}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <CartIcon onClick={() => setIsCartOpen(true)} />
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="border-t bg-gray-50 p-4 md:hidden">
            <Suspense fallback={<div className="h-10" />}>
              <SearchBar />
            </Suspense>
          </div>
        )}

        {/* Mobile Menu: full-screen slide-in from right on small devices */}
  <div className={`fixed inset-0 z-50 md:hidden`} aria-hidden={!isMobileMenuOpen}>
          {/* Backdrop (click to close) */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-30 pointer-events-auto' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sliding panel */}
          <div
            className={`absolute right-0 top-0 h-full w-full bg-white transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="text-xl font-bold text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                  E-Shop
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-700 hover:text-blue-600">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col space-y-4 mt-2">
                <Link href="/" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>

                {isAdmin && (
                  <>
                    <Link href="/dashboard" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                    <Link href="/admin" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                  </>
                )}

                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-base text-gray-600">{user?.name} {isAdmin && '(Admin)'}</span>
                    <Button variant="outline" size="md" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="md">Login</Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

