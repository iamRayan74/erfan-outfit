"use client";

import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  PlusIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Divider from "@/components/ui/Divider";

import Swiper from "swiper";
import "swiper/css";

import { productApi } from "@/features/products/api/productApi";

/* =========================================================
   Skeleton
========================================================= */

function ProductCardSkeleton() {
  return (
    <div className="w-[145px] shrink-0 rounded-2xl border border-cart-boarder bg-primary/5 p-2 shadow-xs sm:w-[165px] md:w-[180px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex min-w-0 flex-col gap-2 px-0.5 py-1.5">
        <Skeleton
          variant="text"
          className="h-3 w-full"
        />

        <Skeleton
          variant="text"
          className="h-3 w-3/4"
        />

        <div className="flex gap-1">
          <Skeleton className="h-3.5 w-5 rounded" />
          <Skeleton className="h-3.5 w-5 rounded" />
        </div>

        <div className="my-1 h-px w-full bg-cart-boarder" />

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <Skeleton
              variant="text"
              className="h-2.5 w-14"
            />

            <Skeleton
              variant="text"
              className="h-3.5 w-16"
            />
          </div>

          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Product Card
========================================================= */

function ProductCard({ product }) {
  const image =
    product?.image ||
    "/images/placeholder-product.png";

  const title =
    product?.title || "محصول بدون نام";

  const price = Number(
    product?.discounted_price ||
      product?.base_price ||
      0
  );

  const originalPrice = Number(
    product?.base_price || 0
  );

  const discountPercent = Number(
    product?.discount_percent || 0
  );

  const availableSizes = Array.isArray(
    product?.sizes
  )
    ? product.sizes
    : [];

  const href = product?.slug
    ? `/products/${product.slug}`
    : "/products";

  return (
    <div className="group/card relative flex w-[145px] shrink-0 cursor-pointer select-none flex-col items-center gap-0 rounded-2xl border border-cart-boarder bg-primary/5 p-2 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#e5c158] hover:bg-primary/10 hover:shadow-md sm:w-[165px] md:w-[180px]">
      {/* Discount */}
      {discountPercent > 0 && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
          {discountPercent.toLocaleString("fa-IR")}٪
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-black/20 shadow-xs">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          sizes="(max-width: 640px) 145px, (max-width: 768px) 165px, 180px"
        />
      </div>

      {/* Content */}
      <div className="mt-1 flex w-full min-w-0 flex-1 flex-col justify-between gap-1 px-0.5 py-1 text-right">
        <div className="flex flex-col items-start space-y-1">
          {/* Category */}
          {product?.category_name && (
            <span className="line-clamp-1 text-[7px] font-medium text-slate-400">
              {product.category_name}
            </span>
          )}

          {/* Title */}
          <h3 className="line-clamp-2 break-words text-[11px] font-bold leading-tight text-product-title transition-colors group-hover/card:text-primary sm:text-xs">
            {title}
          </h3>

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div className="flex flex-wrap items-center gap-0.5">
              <span className="text-[7px] font-bold text-slate-400 sm:text-[8px]">
                سایز:
              </span>

              {availableSizes
                .slice(0, 3)
                .map((size, index) => (
                  <span
                    key={`${size}-${index}`}
                    className="flex h-3.5 w-4 items-center justify-center rounded border border-secondary/10 bg-gray-200/60 text-[7px] font-bold text-primary shadow-2xs backdrop-blur-md sm:h-4 sm:w-5 sm:text-[8px]"
                  >
                    {typeof size === "object"
                      ? size?.name ||
                        size?.title ||
                        size?.value
                      : size}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="my-0.5 h-px w-full bg-gradient-to-r from-transparent via-cart-boarder to-transparent" />

        {/* Price */}
        <div className="mt-0.5 flex w-full items-end justify-between">
          <div className="flex flex-col items-start">
            {originalPrice > price && (
              <span className="text-[9px] font-bold tabular-nums text-gray-400 line-through decoration-red-400/50">
                {originalPrice.toLocaleString("fa-IR")}
              </span>
            )}

            <div className="flex items-center gap-1">
              <span className="text-xs font-black tracking-tighter text-[#263238] tabular-nums sm:text-sm">
                {price.toLocaleString("fa-IR")}
              </span>

              <span className="text-[8px] font-bold text-gray-500">
                تومان
              </span>
            </div>
          </div>

          <Button
            variant="gradient"
            size="sm"
            icon={PlusIcon}
            iconPosition="left"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md !p-0 sm:h-8 sm:w-8 sm:rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              console.log(
                "افزودن به سبد خرید:",
                product?.id
              );
            }}
            aria-label="افزودن به سبد خرید"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Wishlist Products Slider
========================================================= */

export default function WishlistProductsSlider() {
  const swiperRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  const [wishlistProducts, setWishlistProducts] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  /* =======================================================
     دریافت Wishlist
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadWishlistProducts = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        if (typeof window === "undefined") {
          return;
        }

        const accessToken =
          localStorage.getItem("access_token") ||
          localStorage.getItem("accessToken");

        const refreshToken =
          localStorage.getItem("refresh_token") ||
          localStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
          if (isMounted) {
            setWishlistProducts([]);
            setIsLoading(false);
          }

          return;
        }

        /*
         * API مستقیماً آرایه محصولات Wishlist
         * را برمی‌گرداند.
         */
        const wishlistResponse =
          await productApi.getWishlist();

        const wishlistItems = Array.isArray(
          wishlistResponse
        )
          ? wishlistResponse
          : [];

        if (isMounted) {
          setWishlistProducts(wishlistItems);
        }
      } catch (error) {
        console.error(
          "خطا در دریافت لیست علاقه‌مندی‌ها:",
          error
        );

        if (isMounted) {
          setWishlistProducts([]);
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     Swiper
  ======================================================= */

  useEffect(() => {
    if (!swiperRef.current || isLoading) {
      return;
    }

    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.destroy(
        true,
        true
      );

      swiperInstanceRef.current = null;
    }

    if (!wishlistProducts.length) {
      return;
    }

    const swiper = new Swiper(
      swiperRef.current,
      {
        slidesPerView: "auto",
        spaceBetween: 12,
        freeMode: true,
        freeModeMomentum: false,
        speed: 800,
        mousewheel: false,

        keyboard: {
          enabled: true,
        },

        touchRatio: 0.8,
        resistanceRatio: 0.5,

        breakpoints: {
          320: {
            spaceBetween: 10,
          },

          640: {
            spaceBetween: 12,
          },

          768: {
            spaceBetween: 14,
          },

          1024: {
            spaceBetween: 16,
          },
        },
      }
    );

    swiperInstanceRef.current = swiper;

    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(
          true,
          true
        );

        swiperInstanceRef.current = null;
      }
    };
  }, [isLoading, wishlistProducts]);

  /* =======================================================
     Render
  ======================================================= */

  return (
    <section className="w-full space-y-3">
      {/* Header */}
      <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-900 shadow-xs shadow-amber-500/20 sm:h-9 sm:w-9">
          <BookmarkIcon className="h-4 w-4 stroke-[2.2] text-amber-600" />
        </div>

        <div className="relative flex flex-col justify-center">
          <span className="block truncate font-serif text-[8px] font-black uppercase leading-tight tracking-widest text-primary/20 select-none sm:text-[9px]">
            YOUR WISHLIST
          </span>

          <h2 className="text-xs font-bold leading-tight text-neutral-800 sm:text-sm">
            <span className="text-[#332C2D]">
              محصولات موجود در{" "}
            </span>

            <span className="font-rokh text-xs font-bold text-primary sm:text-sm">
              لیست شما
            </span>
          </h2>
        </div>
      </div>

      <Divider
        variant="gradient"
        color="primary"
      />

      {/* Products */}
      <div className="relative px-0.5 md:px-2">
        {isLoading ? (
          <div className="flex gap-3 overflow-hidden pb-2 pt-1">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <ProductCardSkeleton
                  key={index}
                />
              )
            )}
          </div>
        ) : hasError ? (
          <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-cart-boarder bg-primary/5">
            <p className="text-xs font-bold text-gray-500 sm:text-sm">
              دریافت لیست علاقه‌مندی‌ها با خطا
              مواجه شد.
            </p>
          </div>
        ) : !wishlistProducts.length ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-2xl border border-cart-boarder bg-primary/5">
            <BookmarkIcon className="h-8 w-8 text-primary/40" />

            <p className="text-xs font-bold text-gray-500 sm:text-sm">
              هنوز محصولی به لیست علاقه‌مندی‌ها
              اضافه نکرده‌اید.
            </p>
          </div>
        ) : (
          <div
            ref={swiperRef}
            className="overflow-hidden pb-2 pt-1"
          >
            <div className="swiper-wrapper">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="swiper-slide !w-auto"
                >
                  <Link
                    href={
                      product?.slug
                        ? `/products/${product.slug}`
                        : "/products"
                    }
                    className="block"
                  >
                    <ProductCard
                      product={product}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}