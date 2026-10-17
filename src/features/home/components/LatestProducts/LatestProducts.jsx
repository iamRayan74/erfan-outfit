"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";

import SectionHeader from "@/components/common/SectionHeader";
import CategorySidebar from "./components/CategorySidebar";
import CategoryMobileFilter from "./components/CategoryMobileFilter";
import Button from "@/components/ui/Button";

// =========================================================
// دسته‌بندی‌های ثابت Latest Products
// این‌ها با IDهایی که Backend برای category قبول می‌کند
// هماهنگ هستند.
// =========================================================

const LATEST_CATEGORIES = [
  {
    id: "all",
    title: "همه",
  },
  {
    id: "men-clothing",
    title: "پوشاک مردانه",
  },
  {
    id: "women-clothing",
    title: "پوشاک زنانه",
  },
  {
    id: "bags-shoes",
    title: "کیف و کفش",
  },
  {
    id: "kids-clothing",
    title: "پوشاک بچگانه",
  },
  {
    id: "accessories",
    title: "اکسسوری و زیورآلات",
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      type: "spring",
      stiffness: 240,
      damping: 20,
    },
  },
};

export default function LatestProducts({
  latestData = {},
  selectedCategory = "all",
  latestPage = 1,
  isLatestLoading = false,
  changeCategory,
  changeLatestPage,
}) {
  // =========================================================
  // فقط products و targetDate از Backend گرفته می‌شوند
  // =========================================================

  const products = Array.isArray(latestData?.products)
    ? latestData.products
    : [];

  const targetDate = latestData?.targetDate || null;

  // =========================================================
  // pagination فعلاً از Backend فعلی وجود ندارد
  // =========================================================

  const pagination = latestData?.pagination || {};

  const totalPages =
    pagination?.totalPages ||
    pagination?.total_pages ||
    1;

  // =========================================================
  // تغییر دسته‌بندی
  // =========================================================

  const handleCategoryChange = (categoryId) => {
    if (!categoryId) return;

    if (changeCategory) {
      changeCategory(categoryId);
    }
  };

  // =========================================================
  // pagination
  // =========================================================

  const handlePrevious = () => {
    if (
      latestPage > 1 &&
      changeLatestPage &&
      !isLatestLoading
    ) {
      changeLatestPage(latestPage - 1);
    }
  };

  const handleNext = () => {
    if (
      latestPage < totalPages &&
      changeLatestPage &&
      !isLatestLoading
    ) {
      changeLatestPage(latestPage + 1);
    }
  };

  return (
    <section
      dir="rtl"
      className="w-full py-10 sm:py-14 lg:py-16 select-none"
    >
      <div className="mx-auto w-full">
        {/* =====================================================
            Header
        ===================================================== */}

        <div className="mb-7">
          <SectionHeader
            icon={FireIcon}
            titlePrimary="جدیدترین"
            titleSecondary="محصولات"
            watermarkText="NEW PRODUCTS"
            watermarkTextMobile="NEW"
            subtitleMain="آخرین و جدیدترین محصولات"
            subtitleHighlight="جدیدترین"
            subtitleSub="با بهترین کیفیت و قیمت مناسب"
            showSubtitle={true}
            showButton={true}
            buttonText="مشاهده همه محصولات"
            buttonTextMobile="مشاهده همه"
            iconColor="text-fuchsia-300"
            highlightColor="text-fuchsia-600"
            buttonHref="/products"
          />
        </div>

        {/* =====================================================
            Mobile Categories
        ===================================================== */}

        <CategoryMobileFilter
          categories={LATEST_CATEGORIES}
          activeCategory={selectedCategory}
          setActiveCategory={handleCategoryChange}
        />

        {/* =====================================================
            Main
        ===================================================== */}

        <div className="relative rounded-[32px]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[235px_minmax(0,1fr)]">

            {/* =================================================
                Desktop Sidebar
            ================================================= */}

            <div className="hidden lg:block">
              <CategorySidebar
                categories={LATEST_CATEGORIES}
                activeCategory={selectedCategory}
                setActiveCategory={handleCategoryChange}
              />
            </div>

            {/* =================================================
                Products
            ================================================= */}

            <div className="relative min-w-0">

              {/* Desktop pagination */}
              {totalPages > 1 && (
                <div className="absolute -left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
                  <Button
                    variant="gradient"
                    size="sm"
                    icon={ChevronUpIcon}
                    onClick={handlePrevious}
                    disabled={
                      latestPage <= 1 ||
                      isLatestLoading
                    }
                    aria-label="محصولات قبلی"
                    className="!p-0 h-10 w-10 !rounded-[10px]"
                  />

                  <Button
                    variant="gradient"
                    size="sm"
                    icon={ChevronDownIcon}
                    onClick={handleNext}
                    disabled={
                      latestPage >= totalPages ||
                      isLatestLoading
                    }
                    aria-label="محصولات بعدی"
                    className="!p-0 h-10 w-10 !rounded-[10px]"
                  />
                </div>
              )}

              {/* =================================================
                  Products Grid
              ================================================= */}

              <motion.div
                key={`${selectedCategory}-${latestPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {/* Loading */}
                {isLatestLoading ? (
                  Array.from({ length: 6 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="h-32 rounded-[2rem] bg-primary/5 animate-pulse"
                      />
                    )
                  )
                ) : products.length > 0 ? (
                  /* Products */
                  products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))
                ) : (
                  /* Empty */
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400"
                  >
                    <span className="mb-3 block text-5xl">
                      🛍️
                    </span>

                    <p className="text-sm font-medium">
                      محصولی در این دسته‌بندی یافت نشد
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* =================================================
                  Mobile pagination
              ================================================= */}

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3 xl:hidden">
                  <Button
                    variant="gradient"
                    size="sm"
                    icon={ChevronUpIcon}
                    onClick={handlePrevious}
                    disabled={
                      latestPage <= 1 ||
                      isLatestLoading
                    }
                    aria-label="محصولات قبلی"
                    className="!p-0 h-10 w-10 !rounded-[10px]"
                  />

                  <Button
                    variant="gradient"
                    size="sm"
                    icon={ChevronDownIcon}
                    onClick={handleNext}
                    disabled={
                      latestPage >= totalPages ||
                      isLatestLoading
                    }
                    aria-label="محصولات بعدی"
                    className="!p-0 h-10 w-10 !rounded-[10px]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================================================
// Product Card
// =========================================================

function ProductCard({ product }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "";
    }

    if (!mounted) {
      return String(value);
    }

    return new Intl.NumberFormat("fa-IR").format(value);
  };

  // =========================================================
  // Backend fields
  // =========================================================

  const productHref =
    product?.href ||
    `/products/${product?.slug || product?.id}`;

  const image =
    product?.image ||
    "/images/placeholder.png";

  const title =
    product?.title ||
    product?.name ||
    "محصول";

  const price =
    Number(product?.price) || 0;

  const originalPrice =
    Number(product?.originalPrice) || 0;

  const discountPercent =
    Number(product?.discountPercent) || 0;

  const categoryBadgeText =
    product?.categoryBadge ||
    product?.category ||
    "جدید";

  return (
    <motion.div
      variants={itemVariants}
      className="w-full"
    >
      <Link
        href={productHref}
        className="group/card relative flex w-full flex-row items-center gap-3 overflow-hidden rounded-[2rem] border border-cart-boarder bg-primary/5 p-2.5 text-secondary shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#e5c158] hover:bg-primary/10 hover:shadow-md cursor-pointer"
      >
        {/* NEW watermark */}

        <span className="pointer-events-none absolute bottom-1 left-1 z-0 select-none text-6xl font-black tracking-tighter text-primary/5 transition-all duration-500 ease-out group-hover/card:scale-110 group-hover/card:text-primary/25 group-hover/card:drop-shadow-[0_0_15px_rgba(229,193,88,0.4)]">
          NEW
        </span>

        {/* Shine */}

        <div className="pointer-events-none absolute -inset-full top-0 z-10 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-1000 group-hover/card:animate-shine group-hover/card:opacity-100" />

        {/* =====================================================
            Image
        ===================================================== */}

        <div className="relative z-10 h-28 w-28 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-black/20 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.4),0_8px_16px_-6px_rgba(229,193,88,0.15)] sm:h-32 sm:w-32">
          <motion.img
            src={image}
            alt={title}
            initial={{
              opacity: 0,
              scale: 1.05,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          />

          {/* Discount */}

          {discountPercent > 0 && (
            <div className="absolute right-3 top-0 z-20 overflow-hidden rounded-b-xl border border-t-0 border-white/30 bg-white/10 px-1 py-0.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-md sm:right-4">
              <span className="text-[10px] font-black text-primary/90 sm:text-xs">
                {discountPercent}%
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            Content
        ===================================================== */}

        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between gap-1 py-0.5 text-right">
          <div className="flex w-full min-w-0 flex-col gap-1">

            {/* Category */}

            <div>
              <span className="inline-block rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                {categoryBadgeText}
              </span>
            </div>

            {/* Title */}

            <h3 className="line-clamp-2 break-words text-xs font-bold leading-snug text-product-title transition-colors group-hover/card:text-primary sm:text-sm">
              {title}
            </h3>

            {/* Description */}

            {product?.description && (
              <p className="line-clamp-1 text-[10px] font-medium text-[#6E6868]">
                {product.description}
              </p>
            )}
          </div>

          {/* =================================================
              Price
          ================================================= */}

          <div className="mt-1 flex flex-col">
            {originalPrice > price && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tabular-nums text-gray-400 line-through decoration-red-400/50 sm:text-[11px]">
                  {formatPrice(originalPrice)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <span className="text-base font-black tracking-tighter text-[#263238] tabular-nums sm:text-lg">
                {formatPrice(price)}
              </span>

              <span className="text-[9px] font-bold text-gray-500 sm:text-[10px]">
                تومان
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}

        <div className="absolute left-2 top-1/2 z-20 flex h-7 w-7 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-white opacity-0 shadow-lg shadow-primary/30 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100 sm:left-3 sm:h-9 sm:w-9 sm:rounded-lg">
          <ArrowLeftIcon className="h-3.5 w-3.5 stroke-[2.5] sm:h-4 sm:w-4" />
        </div>
      </Link>
    </motion.div>
  );
}