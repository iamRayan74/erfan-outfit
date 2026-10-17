"use client";

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import MegaMenu from './components/MegaMenu';
import GlobalSearch from './components/GlobalSearch';
import Logo from '@/components/ui/Logo';
import AuthModal from '@/features/auth/components/AuthModal';
import UserAuthButton from '@/features/auth/components/UserAuthButton';
import LocationSelector from './components/LocationSelector';
import baseApi from '@/lib/baseApi'; 

import {
  ShoppingBagIcon,
  FireIcon,
  SparklesIcon,
  BookOpenIcon,
  InformationCircleIcon,
  PhoneIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const NAV_ITEMS = [
  { href: '/deals', label: 'شگفت‌انگیزها', icon: FireIcon },
  { href: '/products?ordering=-sales_count', label: 'پرفروش‌ترین‌ها', icon: SparklesIcon },
  { href: '/blog', label: 'وبلاگ', icon: BookOpenIcon },
  { href: '/about', label: 'درباره ما', icon: InformationCircleIcon },
  { href: '/contact', label: 'تماس باما', icon: PhoneIcon },
];

export default function DesktopHeader() {
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [topHeaderHeight, setTopHeaderHeight] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const topHeaderRef = useRef(null);

  const fetchCartCount = useCallback(async () => {
    try {
      const data = await baseApi.get('/cart/');
      const items = Array.isArray(data?.items) ? data.items : [];
      const total = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();

    const onFocus = () => fetchCartCount();
    window.addEventListener('focus', onFocus);

    const onCartUpdated = (event) => {
      const delta = event?.detail?.delta;
      if (typeof delta === 'number') {
        setCartCount((prev) => Math.max(0, prev + delta));
      } else {
        fetchCartCount();
      }
    };
    window.addEventListener('cart:updated', onCartUpdated);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('cart:updated', onCartUpdated);
    };
  }, [fetchCartCount]);

  useEffect(() => {
    if (topHeaderRef.current) {
      setTopHeaderHeight(topHeaderRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHideNav(true);
      } else if (currentScrollY < lastScrollY) {
        setHideNav(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="sticky top-0 z-50">
      {/* بخش بالای هدر */}
      <div
        ref={topHeaderRef}
        className={`bg-white relative z-50 transition-all duration-300 ${
          hideNav ? 'border-b border-secondary/20 shadow-sm' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-8">
            
            {/* سمت راست: لوگو + سرچ سراسری با کنترل Z-Index */}
            <div className="flex items-center gap-6 flex-1 max-w-3xl relative z-20">
              <Logo width={150} height={45} priority={true} />
              <div className="flex-1 relative z-20">
                <GlobalSearch />
              </div>
            </div>

            {/* سمت چپ: سبد خرید + دکمه و منوی کاربری */}
            <div className="flex items-center gap-3 shrink-0 relative z-30">
              <Link
                href="/cart"
                id="cart-btn"
                className="relative p-3 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md hover:border-secondary/20 hover:bg-gray-200 hover:text-white transition-all duration-300 group shadow-lg shadow-secondary-500/10 shrink-0"
              >
                <ShoppingBagIcon className="w-5 h-5 text-secondary transition-colors stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-black min-w-4 h-4 px-1 flex items-center justify-center rounded-lg">
                    {cartCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </Link>

              {/* کانتینر مجزا برای منوی پروفایل */}
              <div className="relative shrink-0">
                <UserAuthButton onOpenAuthModal={() => setIsAuthModalOpen(true)} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* منوی اصلی navigation */}
      <nav
        className="bg-white border-b border-secondary/20 shadow-sm transition-transform duration-500 ease-in-out relative z-40"
        style={{
          transform: hideNav ? `translateY(-${topHeaderHeight}px)` : 'translateY(0)',
          willChange: 'transform',
        }}
      >
        <div className="mx-auto px-8">
          <ul
            className="flex items-center gap-x-6 py-3"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <MegaMenu
              isHovered={hoveredIndex === 'mega'}
              onMouseEnter={() => setHoveredIndex('mega')}
            />

            <div className="h-4 w-[1px] bg-gray-200 shrink-0"></div>

            {NAV_ITEMS.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.href + index}
                  className="relative py-2 cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-600 flex items-center gap-1.5 transition-colors"
                  >
                    <IconComponent className="w-4 h-4 text-gray-400 stroke-[1.8]" />
                    <span>{item.label}</span>
                  </Link>

                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="activeHeaderUnderline"
                      className="absolute -bottom-[12px] right-0 left-0 h-[2px] bg-primary rounded-full z-20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}

            <div className="h-4 w-[1px] bg-gray-200 shrink-0"></div>

            <li
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(99)}
            >
              <Link
                href="/careers"
                className="text-sm font-medium text-gray-600 flex items-center gap-1.5 transition-colors"
              >
                <BriefcaseIcon className="w-4 h-4 text-gray-400 stroke-[1.8]" />
                <span>همکاری</span>
              </Link>
              {hoveredIndex === 99 && (
                <motion.div
                  layoutId="activeHeaderUnderline"
                  className="absolute -bottom-[12px] right-0 left-0 h-[2px] bg-primary rounded-full z-20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </li>

            <li className="mr-auto flex items-center gap-4">
              <div className="h-4 w-[1px] bg-gray-200"></div>
              <LocationSelector />
            </li>
          </ul>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}