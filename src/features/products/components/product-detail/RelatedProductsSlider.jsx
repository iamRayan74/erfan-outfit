"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { productApi } from "../../api/productApi";
import Swiper from "swiper";
import "swiper/css";

// تبدیل داده API به ساختار مورد نیاز کامپوننت
function mapApiProduct(item) {
  const hasDiscount = Number(item.discount_percent) > 0;
  return {
    id: item.id,
    title: item.title,
    price: Number(item.discounted_price || item.base_price || 0),
    originalPrice: hasDiscount ? Number(item.base_price) : null,
    image:
      item?.main_image ||
      item?.image ||
      item?.variants?.[0]?.image ||
      "/images/products/placeholder.png",
    href: `/products/${item.slug}`,
    sizes: item.sizes || [],
  };
}

// کامپوننت اسکلتون کارت محصول
function ProductCardSkeleton() {
  return (
    <div className="w-[170px] xs:w-[185px] sm:w-[200px] md:w-[215px] lg:w-[230px] flex flex-col items-center gap-0 rounded-[1.5rem] bg-primary/5 p-2 border border-cart-boarder shadow-md">
      <Skeleton className="h-36 w-36 xs:h-40 xs:w-40 sm:h-36 sm:w-36 lg:h-52 lg:w-full rounded-[1.2rem]" />
      <div className="flex-1 w-full min-w-0 flex flex-col justify-between gap-2 px-0.5 py-1.5 lg:px-3 lg:py-2.5">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-3/4 h-4" />
          <div className="flex items-center gap-1 pt-1">
            <Skeleton className="w-8 h-3 rounded" />
            <Skeleton className="h-4 w-5 lg:h-[22px] lg:w-[26px] rounded-md lg:rounded-lg" />
            <Skeleton className="h-4 w-5 lg:h-[22px] lg:w-[26px] rounded-md lg:rounded-lg" />
            <Skeleton className="h-4 w-5 lg:h-[22px] lg:w-[26px] rounded-md lg:rounded-lg" />
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cart-boarder to-transparent my-1" />
        <div className="flex items-end justify-between w-full">
          <div className="space-y-1">
            <Skeleton variant="text" className="w-12 h-3" />
            <Skeleton variant="text" className="w-20 h-5" />
          </div>
          <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// کامپوننت کارت محصول
function ProductCard({ product }) {
  const availableSizes = product.sizes || [];

  return (
    <div className="group/card relative w-[170px] xs:w-[185px] sm:w-[200px] md:w-[215px] lg:w-[230px] flex flex-col items-center gap-0 rounded-[1.5rem] bg-primary/5 p-2 border border-cart-boarder shadow-md transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-primary/10 hover:border-[#e5c158] hover:shadow-[0_15px_30px_-12px_rgba(229,193,88,0.25)] cursor-pointer">
      <div className="relative h-36 w-36 xs:h-40 xs:w-40 sm:h-36 sm:w-36 lg:h-52 lg:w-full flex-shrink-0 overflow-hidden rounded-[1.2rem] bg-black/20 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
      </div>

      <div className="flex-1 w-full min-w-0 text-right flex flex-col justify-between gap-1.5 lg:gap-2 px-0.5 py-1.5 lg:px-3 lg:py-2.5">
        <div className="flex flex-col items-start space-y-2">
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-product-title transition-colors group-hover/card:text-primary leading-snug line-clamp-2 break-words">
            {product.title}
          </h3>
          {availableSizes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[8px] lg:text-[9px] font-bold text-slate-400">
                سایزها:
              </span>
              {availableSizes.slice(0, 4).map((size, index) => (
                <span
                  key={index}
                  className="flex h-4 w-5 lg:h-[22px] lg:w-[26px] items-center justify-center rounded-md lg:rounded-lg text-primary border border-secondary/10 bg-gray-200/60 backdrop-blur-md text-[8px] lg:text-[10px] font-bold shadow-sm transition-colors cursor-default"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-cart-boarder to-transparent" />

        <div className="mt-1.5 flex items-end justify-between w-full">
          <div className="flex flex-col items-start">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 font-bold line-through decoration-red-400/50 tabular-nums">
                  {new Intl.NumberFormat("fa-IR").format(product.originalPrice)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black text-[#263238] tabular-nums tracking-tighter">
                {new Intl.NumberFormat("fa-IR").format(product.price)}
              </span>
              <span className="text-[10px] text-gray-500 font-bold">تومان</span>
            </div>
          </div>

          <Button
            variant="gradient"
            size="sm"
            icon={PlusIcon}
            iconPosition="left"
            className="w-8 h-8 sm:w-10 sm:h-10 !p-0 rounded-md sm:rounded-lg flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("افزودن به سبد خرید:", product.id);
            }}
            aria-label="افزودن به سبد خرید"
          />
        </div>
      </div>
    </div>
  );
}

export default function RelatedProductsSlider({ slug, limit = 8 }) {
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ دریافت محصولات مرتبط از API
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getRelatedProducts(slug, limit);
        const items =
          res?.data?.items ||
          res?.results ||
          res?.data?.results ||
          (Array.isArray(res) ? res : []);

        if (cancelled) return;
        setProducts(Array.isArray(items) ? items.map(mapApiProduct) : []);
      } catch (err) {
        console.error("[RELATED PRODUCTS]", err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchRelated();
    return () => {
      cancelled = true;
    };
  }, [slug, limit]);

  useEffect(() => {
    if (swiperRef.current && !swiperInstance && !isLoading && products.length > 0) {
      const swiper = new Swiper(swiperRef.current, {
        slidesPerView: "auto",
        spaceBetween: 20,
        freeMode: true,
        freeModeMomentum: false,
        speed: 800,
        mousewheel: false,
        keyboard: { enabled: true },
        touchRatio: 0.8,
        resistanceRatio: 0.5,
        breakpoints: {
          320: { spaceBetween: 16 },
          640: { spaceBetween: 18 },
          768: { spaceBetween: 20 },
          1024: { spaceBetween: 24 },
        },
      });
      setSwiperInstance(swiper);
    }

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy();
      }
    };
  }, [swiperInstance, isLoading, products.length]);

  const handlePrev = () => swiperInstance?.slidePrev(800);
  const handleNext = () => swiperInstance?.slideNext(800);

  // اگر محصولی وجود ندارد و لود هم تمام شده، نمایش نده
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full pt-6 space-y-4">
      <div className="relative flex items-center gap-2.5 sm:gap-3.5 z-10 shrink-0 pb-2 border-b border-cart-boarder/60">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-md sm:rounded-2xl bg-gradient-to-tr from-primary to-rose-900 flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
          <Squares2X2Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-amber-600" />
        </div>

        <div className="flex flex-col justify-center relative">
          <span className="block md:hidden text-[10px] font-bold tracking-widest text-primary/20 uppercase select-none font-serif truncate max-w-[150px] leading-tight">
            RELATED PRODUCTS
          </span>
          <span className="hidden md:block text-xs sm:text-sm font-black tracking-widest text-primary/20 uppercase select-none font-serif truncate max-w-[250px] leading-tight">
            RELATED PRODUCTS
          </span>

          <h2 className="text-xs sm:text-sm md:text-base font-bold text-neutral-800 leading-tight">
            <span className="text-[#332C2D]">محصولات </span>
            <span className="text-primary text-xs sm:text-base md:text-lg font-rokh font-bold inline-block">
              مرتبط
            </span>
          </h2>
        </div>
      </div>

      <div className="relative px-0.5 md:px-3 lg:px-12">
        <div ref={swiperRef} className="overflow-hidden pb-3 pt-1">
          <div className="swiper-wrapper">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="swiper-slide !w-auto">
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.map((product) => (
                  <div key={product.id} className="swiper-slide !w-auto">
                    <Link href={product.href}>
                      <ProductCard product={product} />
                    </Link>
                  </div>
                ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="flex items-center gap-2 p-3 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md hover:border-secondary/20 hover:bg-gray-200 transition-all duration-300 group shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="اسکرول به چپ"
          >
            <ChevronRightIcon className="w-5 h-5 text-secondary hover:text-lime-950 transition-colors" />
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 p-3 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md hover:border-secondary/20 hover:bg-gray-200 transition-all duration-300 group shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="اسکرول به راست"
          >
            <ChevronLeftIcon className="w-5 h-5 text-secondary hover:text-lime-950 transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
}