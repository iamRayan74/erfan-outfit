"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  XMarkIcon,
  ShoppingBagIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  ShareIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/common/Breadcrumb/Breadcrumb";

import ProductGallery from "@/features/products/components/product-detail/ProductGallery";
import ProductInfo from "@/features/products/components/product-detail/ProductInfo";
import ProductBuyBox from "@/features/products/components/product-detail/ProductBuyBox";
import ProductFeaturesBadge from "@/features/products/components/product-detail/ProductFeaturesBadge";
import ProductSellers from "@/features/products/components/product-detail/ProductSellers";

import ProductDescription from "@/features/products/components/product-detail/ProductDescription";
import ProductReviews from "@/features/products/components/product-detail/ProductReviews";
import ProductQuestions from "@/features/products/components/product-detail/ProductQuestions";

import RelatedProductsSlider from "@/features/products/components/product-detail/RelatedProductsSlider";
import SuggestedProductsSlider from "@/features/products/components/product-detail/SuggestedProductsSlider";
import SpecialOffersBox from "@/features/products/components/product-detail/SpecialOffersBox";
import Advantages from "@/features/advantages/components/Advantages";
import { productApi } from "@/features/products/api/productApi";
import { cartApi } from "@/features/cart/api/cartApi";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [mobileTab, setMobileTab] = useState("info");
  const [desktopTab, setDesktopTab] = useState("desc");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isScrolledToCard, setIsScrolledToCard] = useState(false);
  const mobileScrollContainerRef = useRef(null);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.getProductBySlug(slug);
        if (!cancelled) {
          setProduct(data);
          if (Array.isArray(data?.variants) && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } catch (err) {
        console.error("[PRODUCT ERROR]", err);
        if (!cancelled) setError("خطا در دریافت اطلاعات محصول");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const container = mobileScrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.42;
      setIsScrolledToCard(container.scrollTop >= threshold);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [product]);

  const checkCartStatus = useCallback(async () => {
    if (!product) return;
    try {
      const cartData = await cartApi.getCart();
      const items = Array.isArray(cartData?.items)
        ? cartData.items
        : Array.isArray(cartData)
        ? cartData
        : [];

      const targetProductId = Number(product.id);
      const targetVariantId = selectedVariant?.id
        ? Number(selectedVariant.id)
        : null;

      const found = items.find((item) => {
        const itemProductId = Number(
          item.product_id || item.product?.id || item.product
        );
        const itemVariantId =
          item.variant_id || item.variant?.id || item.variant
            ? Number(item.variant_id || item.variant?.id || item.variant)
            : null;

        if (targetVariantId) {
          return (
            itemProductId === targetProductId &&
            itemVariantId === targetVariantId
          );
        }
        return itemProductId === targetProductId;
      });

      setCartItem(found || null);

      const totalQty = items.reduce(
        (sum, it) => sum + Number(it.quantity || 0),
        0
      );
      setCartCount(totalQty);
    } catch (err) {
      console.error("[CHECK CART]", err);
    }
  }, [product, selectedVariant?.id]);

  useEffect(() => {
    checkCartStatus();
    const onCartUpdated = () => checkCartStatus();
    window.addEventListener("cart:updated", onCartUpdated);
    return () => window.removeEventListener("cart:updated", onCartUpdated);
  }, [checkCartStatus]);

  const handleAddToCart = async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      const res = await cartApi.addItem({
        product_id: product.id,
        variant_id: selectedVariant?.id || null,
        quantity: 1,
      });

      if (typeof window !== "undefined" && res?.session_key) {
        localStorage.setItem("guestSessionKey", res.session_key);
      }

      setAdded(true);

      setTimeout(async () => {
        await checkCartStatus();
        setAdded(false);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cart:updated"));
        }
      }, 1200);
    } catch (err) {
      console.error("[ADD TO CART]", err);
      alert("خطا در افزودن به سبد خرید");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (!cartItem || loadingCart) return;

    const itemId = cartItem.id || cartItem.cart_item_id;
    if (!itemId) {
      await checkCartStatus();
      return;
    }

    setLoadingCart(true);

    try {
      if (newQuantity <= 0) {
        await cartApi.removeItem(itemId);
        setCartItem(null);
      } else {
        await cartApi.updateItem(itemId, Number(newQuantity));
        setCartItem((prev) =>
          prev ? { ...prev, quantity: newQuantity } : null
        );
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
      }
    } catch (err) {
      console.error("[UPDATE QUANTITY]", err);
      alert("خطا در تغییر تعداد محصول");
      await checkCartStatus();
    } finally {
      setLoadingCart(false);
    }
  };

  const handleShowMoreFeatures = () => {
    setDesktopTab("desc");
    setMobileTab("info");
    setTimeout(() => {
      const targetId =
        window.innerWidth < 1024
          ? "product-description-mobile"
          : "product-description";
      const element = document.getElementById(targetId);
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const breadcrumbItems = (() => {
    if (Array.isArray(product?.breadcrumb) && product.breadcrumb.length > 0) {
      return product.breadcrumb
        .filter((b) => b.name !== "خانه" && b.slug !== "home")
        .map((item, index, arr) => {
          const isLast = index === arr.length - 1;
          return {
            label: item.name,
            href: isLast ? undefined : `/products?category=${item.slug}`,
          };
        });
    }

    return [
      {
        label: product?.category?.name || "پوشاک مردانه",
        href: `/products?category=${product?.category?.slug || "men-clothing"}`,
      },
      { label: product?.title || "جزئیات محصول" },
    ];
  })();

  const HeaderButtons = ({ isPinned = false }) => (
    <div className="flex items-center justify-between w-full transition-all duration-300">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className={`w-10 h-10 rounded-2xl border flex items-center justify-center active:scale-90 transition-all duration-200 cursor-pointer pointer-events-auto shadow-xs outline-none ${
          isPinned
            ? "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
            : "border-white/20 bg-black/50 text-white shadow-black/10"
        }`}
      >
        <XMarkIcon className="w-5 h-5 stroke-1.5" />
      </button>

      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center active:scale-90 transition-all duration-200 cursor-pointer shadow-xs outline-none ${
            isPinned
              ? "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
              : "border-white/20 bg-black/50 text-white shadow-black/10"
          }`}
        >
          <ShoppingBagIcon className="w-5 h-5 stroke-1.5" />

          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-black min-w-4 h-4 px-1 flex items-center justify-center rounded-lg">
              {cartCount.toLocaleString("fa-IR")}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsBottomSheetOpen(true)}
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center active:scale-90 transition-all duration-200 cursor-pointer shadow-xs outline-none ${
            isPinned
              ? "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
              : "border-white/20 bg-black/50 text-white shadow-black/10"
          }`}
        >
          <EllipsisVerticalIcon className="w-5 h-5 stroke-1.5" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        در حال دریافت محصول...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-rose-500 font-bold">{error || "محصول یافت نشد"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold"
        >
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="text-gray-800 text-sm pb-24 lg:pb-12 select-none" dir="rtl">
      {/* ================= موبایل ================= */}
      <div
        ref={mobileScrollContainerRef}
        className="lg:hidden fixed inset-0 z-50 bg-stone-900 overflow-y-auto"
      >
        {!isScrolledToCard && (
          <div className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
            <HeaderButtons isPinned={false} />
          </div>
        )}

        <div className="relative w-full h-[55vh]">
          <ProductGallery
            product={product}
            isMobile={true}
            selectedVariant={selectedVariant}
          />
        </div>

        <div className="relative z-20 bg-white rounded-t-[36px] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] px-5 pt-3 pb-24 min-h-[50vh] -mt-6">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

          {isScrolledToCard && (
            <div className="sticky top-0 z-30 bg-white pt-2 pb-3 -mx-5 px-5 border-b border-gray-100 shadow-2xs">
              <HeaderButtons isPinned={true} />
            </div>
          )}

          <div className="my-3 pt-1">
            <Breadcrumb items={breadcrumbItems} isCustomPosition={true} />
          </div>

          <div className="sticky top-[58px] z-20 bg-white py-2 -mx-5 px-5 mb-6 border-b border-gray-100">
            <div className="flex items-center bg-rose-50/70 p-1 font-rokh font-black rounded-2xl relative border border-rose-100">
              <button
                type="button"
                onClick={() => setMobileTab("info")}
                className={`flex-1 py-2.5 text-xs font-bold cursor-pointer rounded-xl outline-none ${
                  mobileTab === "info"
                    ? "bg-white text-primary shadow-xs"
                    : "bg-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                توضیحات
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("reviews_questions")}
                className={`flex-1 py-2.5 text-xs font-bold cursor-pointer rounded-xl outline-none ${
                  mobileTab === "reviews_questions"
                    ? "bg-white text-primary shadow-xs"
                    : "bg-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                نظرات و پرسش‌ها
              </button>
            </div>
          </div>

          {mobileTab === "info" ? (
            <div className="space-y-6">
              <ProductInfo
                product={product}
                onShowMoreFeatures={handleShowMoreFeatures}
                onVariantChange={setSelectedVariant}
              />
              <div className="my-6">
                <ProductBuyBox
                  product={product}
                  selectedVariant={selectedVariant}
                />
              </div>

              <ProductFeaturesBadge product={product} />
              
              <div className="my-6">
                <SpecialOffersBox product={product} />
              </div>

              <div id="product-description-mobile" className="pt-2">
                <ProductDescription
                  product={product}
                  selectedVariant={selectedVariant}
                />
              </div>

              {/* ✅ محصولات مرتبط */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <RelatedProductsSlider slug={slug} limit={8} />
              </div>
              {/* ✅ محصولات پیشنهادی */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <SuggestedProductsSlider slug={slug} limit={6} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <ProductReviews slug={slug} />
              <ProductQuestions slug={slug} />
            </div>
          )}
        </div>

        {isBottomSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setIsBottomSheetOpen(false)}
            />
            <div className="relative w-full max-w-lg bg-white border-t border-gray-100 rounded-t-[32px] p-6 pb-10 shadow-2xl z-50">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    setIsBottomSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {isFavorite
                      ? "حذف از علاقه‌مندی‌ها"
                      : "افزودن به علاقه‌مندی‌ها"}
                  </span>
                  <HeartIcon
                    className={`w-5 h-5 ${
                      isFavorite
                        ? "fill-rose-500 text-rose-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.title,
                        url: window.location.href,
                      });
                    }
                    setIsBottomSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60"
                >
                  <span className="text-sm font-medium text-gray-800">
                    به اشتراک گذاشتن
                  </span>
                  <ShareIcon className="w-5 h-5 text-gray-600 stroke-1.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-3 right-3 z-40 max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-white/95 border border-gray-200/80 p-3.5 shadow-xl ring-1 ring-black/5 mb-2">
            {adding || added ? (
              <Button
                variant="gradient"
                size="md"
                className="w-full !py-3.5 text-xs"
                disabled={adding}
              >
                {adding ? "در حال افزودن..." : "✓ افزوده شد"}
              </Button>
            ) : cartItem ? (
              <div className="space-y-2">
                <div className="text-center text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1 px-3 rounded-lg border border-emerald-100">
                  این محصول در سبد شما موجود می‌باشد
                </div>

                <div className="flex items-center justify-between border border-secondary/20 rounded-2xl p-1 bg-white">
                  <button
                    type="button"
                    disabled={loadingCart}
                    onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <PlusIcon className="w-4 h-4 stroke-2" />
                  </button>

                  <span className="font-extrabold text-sm text-gray-800 tabular-nums">
                    {cartItem.quantity.toLocaleString("fa-IR")}
                  </span>

                  <button
                    type="button"
                    disabled={loadingCart}
                    onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {cartItem.quantity === 1 ? (
                      <TrashIcon className="w-4 h-4 stroke-2" />
                    ) : (
                      <MinusIcon className="w-4 h-4 stroke-2" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="gradient"
                  size="md"
                  icon={ShoppingBagIcon}
                  iconPosition="right"
                  className="flex-1 !py-3.5 text-xs"
                  onClick={handleAddToCart}
                >
                  افزودن به سبد خرید
                </Button>

                <div className="flex flex-col items-end justify-center shrink-0 pl-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {Number(product.discount_percent) > 0 && (
                      <span className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-30 animate-ping" />
                        <span className="relative text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-0.5 rounded-full">
                          ٪
                          {Number(product.discount_percent).toLocaleString(
                            "fa-IR"
                          )}
                        </span>
                      </span>
                    )}
                    {Number(product.discount_percent) > 0 && (
                      <span className="text-[11px] font-medium text-gray-400 line-through decoration-rose-500/50">
                        {Number(product.base_price).toLocaleString("fa-IR")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black tracking-tight text-gray-900">
                      {Number(product.final_price).toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= دسکتاپ ================= */}
      <div className="hidden lg:block container space-y-8 mx-auto py-4">
        <div className="mb-2">
          <Breadcrumb items={breadcrumbItems} isCustomPosition={true} />
        </div>

        <div className="grid grid-cols-12 gap-6 items-start mt-4">
          <div className="col-span-4">
            <ProductGallery
              product={product}
              isMobile={false}
              selectedVariant={selectedVariant}
            />
          </div>
          <div className="col-span-5">
            <ProductInfo
              product={product}
              onShowMoreFeatures={handleShowMoreFeatures}
              onVariantChange={setSelectedVariant}
            />
          </div>
          <div className="col-span-3">
            <ProductBuyBox
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>

      
        <Advantages variant="monochrome" />
        

        <div className="w-full bg-rose-50/70 rounded-2xl mt-4 py-2.5">
          <div className="flex justify-start">
            <div className="flex items-center font-rokh font-black gap-2 min-w-[500px]">
              <button
                type="button"
                onClick={() => setDesktopTab("desc")}
                className={`flex-1 py-2.5 px-6 text-sm font-bold cursor-pointer text-center rounded-xl outline-none ${
                  desktopTab === "desc"
                    ? "bg-white text-primary shadow-xs"
                    : "bg-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                توضیحات محصول
              </button>
              <button
                type="button"
                onClick={() => setDesktopTab("reviews")}
                className={`flex-1 py-2.5 px-6 text-sm font-bold cursor-pointer text-center rounded-xl outline-none ${
                  desktopTab === "reviews"
                    ? "bg-white text-primary shadow-xs"
                    : "bg-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                نظرات کاربران
              </button>
              <button
                type="button"
                onClick={() => setDesktopTab("questions")}
                className={`flex-1 py-2.5 px-6 text-sm font-bold cursor-pointer text-center rounded-xl outline-none ${
                  desktopTab === "questions"
                    ? "bg-white text-primary shadow-xs"
                    : "bg-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                پرسش و پاسخ
              </button>
            </div>
          </div>
        </div>

        <div id="product-description">
          {desktopTab === "desc" && (
            <ProductDescription
              product={product}
              selectedVariant={selectedVariant}
            />
          )}
          {desktopTab === "reviews" && <ProductReviews slug={slug} />}
          {desktopTab === "questions" && <ProductQuestions slug={slug} />}
        </div>

        {/* ✅ محصولات مرتبط */}
        <div className="pt-8 border-t border-gray-100">
          <RelatedProductsSlider slug={slug} limit={8} />
        </div>
        {/* ✅ محصولات پیشنهادی */}
        <div className="pt-8 border-t border-gray-100">
          <SuggestedProductsSlider slug={slug} limit={6} />
        </div>
      </div>
    </div>
  );
}