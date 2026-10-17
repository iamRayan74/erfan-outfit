"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { productApi } from "@/features/products/api/productApi";
import { fixImageUrl } from "@/lib/baseApi";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

import Swiper from "swiper";
import "swiper/css";

function ProductCardSkeleton() {
  return (
    <div className="w-[170px] xs:w-[185px] sm:w-[200px] md:w-[215px] lg:w-[230px] flex flex-col items-center gap-0 rounded-[1.5rem] bg-primary/5 p-2 border border-cart-boarder shadow-md">
      <Skeleton
        className="h-36 w-36 xs:h-40 xs:w-40 sm:h-36 sm:w-36 lg:h-52 lg:w-full rounded-[1.2rem]"
      />

      <div className="flex-1 w-full min-w-0 flex flex-col justify-between gap-2 px-0.5 py-1.5 lg:px-3 lg:py-2.5">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-3/4 h-4" />

          <div className="flex items-center gap-1 pt-1">
            <Skeleton className="w-8 h-3 rounded" />
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

function ProductCard({ product }) {
  const availableSizes =
    product?.sizes && product.sizes.length > 0
      ? product.sizes
      : ["L", "XL"];

  const title = product?.title || product?.name || "بدون عنوان";

  const image = product?.image
    ? fixImageUrl(product.image)
    : product?.main_image
      ? fixImageUrl(product.main_image)
      : product?.variants?.[0]?.image
        ? fixImageUrl(product.variants[0].image)
        : "/images/placeholder.png";

  const price = Number(
    product?.discounted_price ||
      product?.price ||
      product?.base_price ||
      0
  );

  const originalPrice = Number(
    product?.base_price ||
      product?.originalPrice ||
      product?.old_price ||
      price
  );

  const discountPercent = Number(
    product?.discount_percent ||
      product?.discountPercent ||
      product?.discount ||
      0
  );

  return (
    <div className="group/card relative w-[170px] xs:w-[185px] sm:w-[200px] md:w-[215px] lg:w-[230px] flex flex-col items-center gap-0 rounded-[1.5rem] bg-primary/5 p-2 border border-cart-boarder shadow-md transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-primary/10 hover:border-[#e5c158] hover:shadow-[0_15px_30px_-12px_rgba(229,193,88,0.25)] cursor-pointer">
      {/* تصویر */}
      <div className="relative h-36 w-36 xs:h-40 xs:w-40 sm:h-36 sm:w-36 lg:h-52 lg:w-full flex-shrink-0 overflow-hidden rounded-[1.2rem] bg-black/10 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)]">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized={
            image.startsWith("http") || image.endsWith(".png")
          }
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 215px, 230px"
        />

        {/* تخفیف */}
        {discountPercent > 0 && (
          <div className="absolute top-0 right-3 lg:right-4 z-20 overflow-hidden rounded-b-lg rounded-t-none bg-white/10 backdrop-blur-md border border-t-0 border-white/30 px-1 py-0.5 shadow-md">
            <span className="font-black text-[9px] lg:text-[11px] text-primary">
              %{discountPercent}
            </span>
          </div>
        )}
      </div>

      {/* اطلاعات محصول */}
      <div className="flex-1 w-full min-w-0 text-right flex flex-col justify-between gap-1.5 lg:gap-2 px-0.5 py-1.5 lg:px-3 lg:py-2.5">
        <div className="flex flex-col items-start space-y-2">
          {/* عنوان */}
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-product-title transition-colors group-hover/card:text-primary leading-snug line-clamp-2 break-words">
            {title}
          </h3>

          {/* سایزها */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[8px] lg:text-[9px] font-bold text-slate-400">
              سایزها:
            </span>

            {availableSizes.slice(0, 4).map((size, index) => (
              <span
                key={index}
                className="flex h-4 w-5 lg:h-[22px] lg:w-[26px] items-center justify-center rounded-md lg:rounded-lg text-primary border border-secondary/10 bg-gray-200/60 backdrop-blur-md text-[8px] lg:text-[10px] font-bold shadow-sm cursor-default"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* خط جداکننده */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cart-boarder to-transparent my-1" />

        {/* قیمت + افزودن */}
        <div className="mt-1.5 flex items-end justify-between w-full">
          <div className="flex flex-col items-start">
            {originalPrice > price && (
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold line-through decoration-red-400/50 tabular-nums">
                {new Intl.NumberFormat("fa-IR").format(originalPrice)}
              </span>
            )}

            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg lg:text-xl font-black text-[#263238] tabular-nums tracking-tighter">
                {new Intl.NumberFormat("fa-IR").format(price)}
              </span>

              <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold">
                تومان
              </span>
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

export default function ProductSliderBlock({ block }) {
  const swiperRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!block) {
      setIsLoading(false);
      return;
    }

    if (Array.isArray(block.products) && block.products.length > 0) {
      setProducts(block.products);
      setIsLoading(false);
      return;
    }

    const ids = block.product_ids || [];

    if (ids.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const res = await productApi.getProducts({
          ids: ids.join(","),
        });

        let items = [];

        if (Array.isArray(res)) {
          items = res;
        } else if (Array.isArray(res?.items)) {
          items = res.items;
        } else if (Array.isArray(res?.results)) {
          items = res.results;
        } else if (Array.isArray(res?.data?.items)) {
          items = res.data.items;
        } else if (Array.isArray(res?.data?.results)) {
          items = res.data.results;
        } else if (Array.isArray(res?.data)) {
          items = res.data;
        }

        if (cancelled) return;

        setProducts(items);
      } catch (error) {
        console.error("[PRODUCT SLIDER] error:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [block]);

  // ساخت Swiper
  useEffect(() => {
    if (!swiperRef.current || isLoading || products.length === 0) {
      return;
    }

    // اگر قبلاً ساخته شده، اول destroy شود
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.destroy(true, true);
      swiperInstanceRef.current = null;
    }

    const swiper = new Swiper(swiperRef.current, {
      slidesPerView: "auto",
      spaceBetween: 16,
      freeMode: true,
      speed: 600,

      breakpoints: {
        640: {
          spaceBetween: 18,
        },
        768: {
          spaceBetween: 20,
        },
        1024: {
          spaceBetween: 24,
        },
      },
    });

    swiperInstanceRef.current = swiper;

    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [products, isLoading]);

  if (!block) return null;

  if (isLoading) {
    return (
      <section className="w-full my-8">
        {block.title && (
          <h2 className="text-xl font-bold text-product-title mb-4">
            {block.title}
          </h2>
        )}

        <div className="relative px-3 md:px-6 lg:px-12">
          <div className="overflow-hidden pb-3 pt-1">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const handlePrev = () => {
    swiperInstanceRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperInstanceRef.current?.slideNext();
  };

  return (
    <section className="w-full my-8 space-y-4">
      {/* عنوان بلاک */}
      {block.title && (
        <h2 className="text-xl font-bold text-product-title px-3 md:px-6 lg:px-12">
          {block.title}
        </h2>
      )}

      {/* اسلایدر */}
      <div className="relative px-3 md:px-6 lg:px-12">
        <div
          ref={swiperRef}
          className="overflow-hidden pb-3 pt-1"
        >
          <div className="swiper-wrapper">
            {products.map((product) => {
              const productHref = `/products/${
                product.slug || product.id
              }`;

              return (
                <div
                  key={product.id}
                  className="swiper-slide !w-auto"
                >
                  <Link href={productHref}>
                    <ProductCard product={product} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chevron ها */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center justify-center p-3 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md hover:border-secondary/20 hover:bg-gray-200 transition-all shadow-md"
            aria-label="قبلی"
          >
            <ChevronRightIcon className="w-5 h-5 text-secondary" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center justify-center p-3 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md hover:border-secondary/20 hover:bg-gray-200 transition-all shadow-md"
            aria-label="بعدی"
          >
            <ChevronLeftIcon className="w-5 h-5 text-secondary" />
          </button>
        </div>
      </div>
    </section>
  );
}