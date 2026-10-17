"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  HeartIcon,
  ShoppingBagIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Divider from "@/components/ui/Divider";

import { productApi } from "@/features/products/api/productApi";

/* =========================================================
   Skeleton
========================================================= */

function WishlistProductSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-cart-boarder bg-primary/5 p-2 shadow-xs">
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

        <div className="flex items-end justify-between gap-2">
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

function ProductCard({
  product,
  onRemove,
}) {
  const image =
    product?.image ||
    "/images/placeholder-product.png";

  const title =
    product?.title ||
    "محصول بدون نام";

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
    <article className="group/card relative flex w-full min-w-0 cursor-pointer select-none flex-col items-center gap-0 rounded-2xl border border-cart-boarder bg-primary/5 p-2 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#e5c158] hover:bg-primary/10 hover:shadow-md">
      {/* =====================================================
          Remove Wishlist
      ===================================================== */}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onRemove(product?.id);
        }}
        aria-label="حذف از علاقه‌مندی‌ها"
        className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-white/90 text-red-500 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white active:scale-90"
      >
        <HeartIcon className="h-4 w-4 fill-red-500 stroke-red-500" />
      </button>

      {/* =====================================================
          Discount
      ===================================================== */}

      {discountPercent > 0 && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
          {discountPercent.toLocaleString("fa-IR")}٪
        </div>
      )}

      {/* =====================================================
          Image
      ===================================================== */}

      <Link
        href={href}
        className="block w-full"
        onClick={(e) => {
          // جلوگیری از کلیک کارت هنگام حذف
          if (e.defaultPrevented) {
            e.stopPropagation();
          }
        }}
      >
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-black/20 shadow-xs">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 180px"
          />
        </div>
      </Link>

      {/* =====================================================
          Content
      ===================================================== */}

      <div className="mt-1 flex w-full min-w-0 flex-1 flex-col justify-between gap-1 px-0.5 py-1 text-right">
        <div className="flex flex-col items-start space-y-1">
          {/* Category */}

          {product?.category_name && (
            <span className="line-clamp-1 text-[7px] font-medium text-slate-400">
              {product.category_name}
            </span>
          )}

          {/* Title */}

          <Link
            href={href}
            className="w-full min-w-0"
          >
            <h3 className="line-clamp-2 break-words text-[11px] font-bold leading-tight text-product-title transition-colors group-hover/card:text-primary sm:text-xs">
              {title}
            </h3>
          </Link>

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
                    {typeof size ===
                    "object"
                      ? size?.name ||
                        size?.title ||
                        size?.value
                      : size}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Divider */}

        <div className="my-0.5 h-px w-full bg-gradient-to-r from-transparent via-cart-boarder to-transparent" />

        {/* ===================================================
            Price
        =================================================== */}

        <div className="mt-0.5 flex w-full items-end justify-between gap-1">
          <div className="flex min-w-0 flex-col items-start">
            {originalPrice > price && (
              <span className="text-[9px] font-bold tabular-nums text-gray-400 line-through decoration-red-400/50">
                {originalPrice.toLocaleString(
                  "fa-IR"
                )}
              </span>
            )}

            <div className="flex items-center gap-1">
              <span className="text-xs font-black tracking-tighter text-[#263238] tabular-nums sm:text-sm">
                {price.toLocaleString(
                  "fa-IR"
                )}
              </span>

              <span className="text-[8px] font-bold text-gray-500">
                تومان
              </span>
            </div>
          </div>

          {/* Add to cart */}

          <Button
            variant="gradient"
            size="sm"
            icon={ShoppingBagIcon}
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
    </article>
  );
}

/* =========================================================
   Wishlist Products
========================================================= */

export default function WishlistProducts() {
  const [products, setProducts] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     Fetch Wishlist
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        const accessToken =
          localStorage.getItem(
            "access_token"
          ) ||
          localStorage.getItem(
            "accessToken"
          );

        const refreshToken =
          localStorage.getItem(
            "refresh_token"
          ) ||
          localStorage.getItem(
            "refreshToken"
          );

        if (
          !accessToken &&
          !refreshToken
        ) {
          if (isMounted) {
            setProducts([]);
            setIsLoading(false);
          }

          return;
        }

        const wishlistResponse =
          await productApi.getWishlist();

        const wishlistItems =
          Array.isArray(
            wishlistResponse
          )
            ? wishlistResponse
            : [];

        if (isMounted) {
          setProducts(
            wishlistItems
          );
        }
      } catch (err) {
        console.error(
          "خطا در دریافت علاقه‌مندی‌ها:",
          err
        );

        if (isMounted) {
          setError(
            err?.message ||
              "دریافت لیست علاقه‌مندی‌ها با خطا مواجه شد."
          );

          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     Remove
  ======================================================= */

  const handleRemove = async (
    productId
  ) => {
    try {
      /*
       * توجه:
       * در API فعلی شما DELETE به /wishlist/{id}/
       * شناسه WishlistItem می‌خواهد، نه product id.
       *
       * بنابراین تا زمانی که backend مقدار wishlist_id
       * را برنگرداند، حذف با productId خطای 404 می‌دهد.
       */

      await productApi.removeFromWishlist(
        productId
      );

      setProducts((prev) =>
        prev.filter(
          (product) =>
            Number(product.id) !==
            Number(productId)
        )
      );
    } catch (err) {
      console.error(
        "خطا در حذف محصول از علاقه‌مندی‌ها:",
        err
      );
    }
  };

  /* =======================================================
     Loading
  ======================================================= */

  if (isLoading) {
    return (
      <section className="w-full space-y-5">
        {/* Header */}

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              علاقه‌مندی‌ها
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              محصولاتی که ذخیره کرده‌اید
            </p>
          </div>
        </div>

        <Divider
          variant="gradient"
          color="primary"
        />

        {/* Skeleton Grid */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <WishlistProductSkeleton
              key={index}
            />
          ))}
        </div>
      </section>
    );
  }

  /* =======================================================
     Error
  ======================================================= */

  if (error) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  /* =======================================================
     Empty
  ======================================================= */

  if (!products.length) {
    return (
      <section className="w-full">
        <div className="rounded-3xl border border-cart-boarder bg-primary/5 px-6 py-14 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HeartIcon className="h-8 w-8 text-primary/50" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-product-title">
            لیست علاقه‌مندی‌ها خالی است
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
            هنوز محصولی را به علاقه‌مندی‌های
            خود اضافه نکرده‌اید.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block"
          >
            <Button variant="primary">
              مشاهده محصولات
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  /* =======================================================
     Main
  ======================================================= */

  return (
    <section className="w-full space-y-5">
      {/* Header */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-rokh font-bold text-product-title">
            علاقه‌مندی‌ها
          </h2>

          <p className="mt-1 text-sm text-muted">
            {products.length.toLocaleString(
              "fa-IR"
            )}{" "}
            محصول در لیست علاقه‌مندی‌های شما
          </p>
        </div>
      </div>

      <Divider
        variant="gradient"
        color="primary"
      />

      {/* ===================================================
          Products
      =================================================== */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </section>
  );
}