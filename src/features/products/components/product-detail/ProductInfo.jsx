"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  ChevronLeftIcon,
  SparklesIcon,
  PlayIcon,
  PauseIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import Divider from "@/components/ui/Divider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import SizeGuideModal from "./SizeGuideModal";
import SpecialOffersBox from "./SpecialOffersBox";
import { productApi } from "../../api/productApi";

function toFa(n) {
  if (n === null || n === undefined) return "";
  return Number(n).toLocaleString("fa-IR");
}

export default function ProductInfo({
  product,
  onShowMoreFeatures,
  audioSrc,
  onVariantChange,
}) {
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ state برای آمار نظرات
  const [reviewStats, setReviewStats] = useState({
    count: product?.reviews_count || 0,
    average: Number(product?.rating) || 0,
  });

  // ✅ state برای تعداد پرسش‌ها
  const [questionStats, setQuestionStats] = useState({
    count: product?.questions_count || 0,
  });

  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);

  const variants = product?.variants || [];

  const uniqueColors = useMemo(() => {
    const map = new Map();
    variants.forEach((v) => {
      if (v.color_name && v.color_hex && !map.has(v.color_name)) {
        map.set(v.color_name, { id: v.id, name: v.color_name, hex: v.color_hex });
      }
    });
    return Array.from(map.values());
  }, [variants]);

  const allSizes = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => (v.sizes || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [variants]);

  const selectedVariant = useMemo(() => {
    if (!selectedColorId && !selectedSize) return variants[0] || null;
    return (
      variants.find(
        (v) =>
          (!selectedColorId || v.color_name === selectedColorId) &&
          (!selectedSize || (v.sizes || []).includes(selectedSize))
      ) ||
      variants.find((v) => v.color_name === selectedColorId) ||
      null
    );
  }, [variants, selectedColorId, selectedSize]);

  useEffect(() => {
    if (!selectedColorId && uniqueColors.length > 0) {
      setSelectedColorId(uniqueColors[0].name);
    }
    if (!selectedSize && allSizes.length > 0) {
      setSelectedSize(allSizes[0]);
    }
  }, [uniqueColors, allSizes, selectedColorId, selectedSize]);

  useEffect(() => {
    if (onVariantChange && selectedVariant) {
      onVariantChange(selectedVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant?.id]);

  // ✅ گرفتن دیدگاه‌ها و محاسبه میانگین + تعداد
  useEffect(() => {
    if (!product?.slug) return;
    let cancelled = false;

    const fetchReviewStats = async () => {
      try {
        const res = await productApi.getProductReviews(product.slug);
        const items =
          res?.data?.items ||
          res?.results ||
          res?.data?.results ||
          (Array.isArray(res) ? res : []);

        if (cancelled || !Array.isArray(items)) return;

        const count = items.length;
        const totalRating = items.reduce(
          (sum, r) => sum + (Number(r.rating) || 0),
          0
        );
        const average = count > 0 ? totalRating / count : 0;

        setReviewStats({
          count,
          average: Math.round(average * 10) / 10,
        });
      } catch (err) {
        console.error("[REVIEW STATS]", err);
      }
    };

    fetchReviewStats();
    return () => {
      cancelled = true;
    };
  }, [product?.slug]);

  // ✅ گرفتن پرسش‌ها و محاسبه تعداد
  useEffect(() => {
    if (!product?.slug) return;
    let cancelled = false;

    const fetchQuestionStats = async () => {
      try {
        const res = await productApi.getProductQuestions(product.slug);
        const items =
          res?.data?.items ||
          res?.results ||
          res?.data?.results ||
          (Array.isArray(res) ? res : []);

        if (cancelled || !Array.isArray(items)) return;

        setQuestionStats({ count: items.length });
      } catch (err) {
        console.error("[QUESTION STATS]", err);
      }
    };

    fetchQuestionStats();
    return () => {
      cancelled = true;
    };
  }, [product?.slug]);

  // ------- Audio -------
  const currentAudioUrl =
    audioSrc || product?.ai?.audio_url || "/assets/Almaxanim.mp3";

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#DDD6FE",
      progressColor: "#7C3AED",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorWidth: 0,
      height: 26,
      url: currentAudioUrl,
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => setIsLoaded(true));
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));

    return () => ws.destroy();
  }, [currentAudioUrl]);

  const toggleAudio = (e) => {
    e.stopPropagation();
    wavesurferRef.current?.playPause();
  };

  const handleShowMoreClick = () => {
    if (onShowMoreFeatures) onShowMoreFeatures();
    else
      document
        .getElementById("product-description")
        ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenReviews = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("product:openReviews"));
    }
  };

  const handleOpenQuestions = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("product:openQuestions"));
    }
  };

  const features = useMemo(() => {
    const list = product?.attributes || [];
    return list.map((a) => ({ title: a.key, value: a.value }));
  }, [product]);

  const vendor = product?.vendor_info || {};

  return (
    <div className="space-y-3">
      {/* برند و عنوان */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-rokh bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
            {product?.gender_label || product?.brand || "محصول"}
          </span>
        </div>

        <h1 className="text-base lg:text-lg font-bold text-gray-900 mt-2 leading-relaxed">
          {product?.title || "—"}
        </h1>

        {product?.short_description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {product.short_description}
          </p>
        )}
      </div>

      <Divider variant="gradient" color="primary" />

      {/* ✅ امتیاز و نظرات با داده واقعی */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="text-amber-500 font-bold flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-amber-400" />
          <span className="text-text-primary">
            {reviewStats.average > 0
              ? reviewStats.average.toLocaleString("fa-IR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              : "۰.۰"}
          </span>
          <span className="text-gray-400 font-normal">
            (امتیاز {toFa(product?.rating_count || reviewStats.count)} خریدار)
          </span>
        </span>

        <button
          type="button"
          onClick={handleOpenReviews}
          className="flex items-center justify-center text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full hover:bg-primary-hover/10 transition-colors cursor-pointer"
        >
          {toFa(reviewStats.count)} دیدگاه
        </button>

        <button
          type="button"
          onClick={handleOpenQuestions}
          className="flex items-center justify-center text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full hover:bg-primary-hover/10 transition-colors cursor-pointer"
        >
          {toFa(questionStats.count)} پرسش
        </button>
      </div>

      {/* رنگ و سایز موبایل */}
      <div className="block lg:hidden">
        {uniqueColors.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">رنگ:</span>
              <span className="font-bold text-sm">{selectedColorId || "—"}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {uniqueColors.map((color) => {
                const isSelected = selectedColorId === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorId(color.name)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-secondary/50 bg-gray-300 text-primary shadow-md"
                        : "border-secondary/10 bg-gray-200/60 backdrop-blur-md text-secondary hover:bg-gray-200"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {allSizes.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">سایز:</span>
                <span className="font-bold text-sm">{selectedSize || "—"}</span>
              </div>
              <SizeGuideModal />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allSizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-secondary/50 bg-gray-300 text-primary shadow-md"
                        : "border-secondary/10 bg-gray-200/60 backdrop-blur-md text-secondary"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* باکس AI */}
      <div className="pt-2">
        <div className="bg-violet-50/70 border border-violet-200/80 rounded-2xl p-2.5 px-3 flex items-center justify-between gap-3 shadow-xs select-none overflow-hidden">
          <div className="text-right shrink-0 flex items-center gap-1.5 sm:gap-2">
            <SparklesIcon className="w-5 h-5 text-violet-600 shrink-0 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-violet-950 whitespace-nowrap">
                معرفی محصول
              </div>
              <div className="text-[10px] text-violet-600/90 font-medium whitespace-nowrap">
                توسط هوش مصنوعی
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 [direction:ltr] min-w-0 flex-1 justify-start">
            <button
              type="button"
              onClick={toggleAudio}
              disabled={!isLoaded}
              className="w-9 h-9 rounded-full bg-white text-violet-600 shadow-md flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 z-10"
            >
              {isPlaying ? (
                <PauseIcon className="w-4 h-4 text-violet-600" />
              ) : (
                <PlayIcon className="w-4 h-4 text-violet-600 ml-0.5" />
              )}
            </button>

            <div
              ref={containerRef}
              className="flex-1 min-w-0 cursor-pointer overflow-hidden max-w-[180px] sm:max-w-none"
            />
          </div>
        </div>
      </div>

      {/* رنگ و سایز دسکتاپ */}
      <div className="hidden lg:block">
        {uniqueColors.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">رنگ:</span>
              <span className="font-bold text-sm">{selectedColorId || "—"}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {uniqueColors.map((color) => {
                const isSelected = selectedColorId === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorId(color.name)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-secondary/50 bg-gray-300 text-primary shadow-md"
                        : "border-secondary/10 bg-gray-200/60 backdrop-blur-md text-secondary hover:bg-gray-200"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {allSizes.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">سایز:</span>
                <span className="font-bold text-sm">{selectedSize || "—"}</span>
              </div>
              <SizeGuideModal />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allSizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-secondary/50 bg-gray-300 text-primary shadow-md"
                        : "border-secondary/10 bg-gray-200/60 backdrop-blur-md text-secondary"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ویژگی‌ها */}
      {features.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <span className="font-bold text-sm block mb-3">ویژگی‌ها</span>

          <div className="block lg:hidden">
            <Swiper
              spaceBetween={8}
              slidesPerView={2.2}
              grabCursor
              className="w-full !py-1"
            >
              {features.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-surface border border-cart-boarder backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] rounded-xl p-3 h-full">
                    <span className="text-xs text-gray-400 block mb-1">
                      {item.title}
                    </span>
                    <span className="text-xs font-bold text-gray-700 block truncate">
                      {item.value}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div
            className={`hidden lg:grid gap-2 ${
              features.length > 2 ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-surface border border-cart-boarder backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] rounded-xl p-3"
              >
                <span className="text-xs text-gray-400 block mb-1">
                  {item.title}
                </span>
                <span className="text-xs font-bold text-gray-700 block">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مشاهده همه ویژگی‌ها */}
      <Divider variant="gradient" color="primary" className="hidden lg:flex">
        <button
          onClick={handleShowMoreClick}
          className="text-xs text-primary font-bold flex items-center gap-1.5 border border-secondary/15 bg-gray-200/50 backdrop-blur-md px-3.5 py-2 rounded-xl hover:bg-gray-300/60 hover:border-secondary/30 transition-all cursor-pointer shadow-xs"
        >
          <span>مشاهده همه ویژگی‌ها</span>
          <ChevronLeftIcon className="w-4 h-4 text-primary" />
        </button>
      </Divider>

      {/* باکس ارسال رایگان و اقساط */}
      <div className="hidden lg:block">
        <SpecialOffersBox />
      </div>
    </div>
  );
}