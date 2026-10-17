'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import Input from '@/components/ui/Input'; // مسیر ایمپورت کامپوننت Input پروژه شما

export default function NotFound() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // تابع مدیریت جستجو و انتقال به صفحه محصولات
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="container max-w-4xl mx-auto text-center">
        
        {/* بخش گرافیکی / عدد 404 با المان‌های فروشگاهی */}
        <span className="text-[10rem] md:text-[14rem] font-extrabold font-fanum text-primary/50 leading-none tracking-widest opacity-80">
            404
          </span>

        {/* متن‌ها */}
        <h1 className="text-2xl md:text-3xl font-bold font-rokh text-primary mb-3">
          صفحه‌ای که دنبالش بودید را پیدا نکردیم!
        </h1>
        <p className=" text-secondary max-w-md mx-auto text-sm md:text-base mb-8">
          به نظر می‌رسد این لباس یا صفحه از قفسه فروشگاه ما خارج شده یا آدرس را به اشتباه وارد کرده‌اید. می‌توانید به صفحه اصلی برگردید یا جدیدترین‌های پوشاک را ببینید.
        </p>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-[var(--color-primary-hover)] text-[var(--color-button-text)] font-medium px-8 py-3.5 rounded-[var(--color-radius-md,12px)] transition-all shadow-[var(--shadow-card)]"
          >
            <HomeIcon className="w-5 h-5" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-surface)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] font-medium px-8 py-3.5 rounded-[var(--color-radius-md,12px)] transition-all border border-[var(--color-border)]"
          >
            <span>مشاهده محصولات پوشاک</span>
            <ArrowRightIcon className="w-5 h-5 rotate-180" />
          </Link>
        </div>

        {/* بخش جستجوی سریع با استفاده از Input سفارشی پروژه */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] max-w-md mx-auto">
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            به دنبال محصول خاصی هستید؟ از جستجوی سایت استفاده کنید:
          </p>
          
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی لباس، هودی، شلوار..."
              startIcon={MagnifyingGlassIcon}
              endIcon={
                <button 
                  type="submit"
                  className="text-gray-400 hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  title="جستجو"
                >
                  <ArrowRightIcon className="w-5 h-5 rotate-180" />
                </button>
              }
              className="py-3"
            />
          </form>
        </div>

      </div>
    </div>
  );
}