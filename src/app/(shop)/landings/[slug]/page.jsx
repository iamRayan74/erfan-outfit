"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BlockRenderer from "@/features/landing-builder/components/BlockRenderer";
import { landingApi } from "@/features/landing-builder/api/landingApi";

export default function LandingPage() {
  const params = useParams();
  const slug = params?.slug;

  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchLanding = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await landingApi.getLandingBySlug(slug);
        if (!cancelled) setLandingData(data);
      } catch (err) {
        console.error("[LANDING ERROR]", err);
        if (!cancelled) setError("خطا در دریافت اطلاعات لندینگ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLanding();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  text-gray-500" dir="rtl">
        در حال بارگذاری...
      </div>
    );
  }

  if (error || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center  text-gray-500" dir="rtl">
        {error || "صفحه لندینگ مورد نظر یافت نشد."}
      </div>
    );
  }

  return (
    <main className="min-h-screen  w-full" dir="rtl">
      {/* ✅ عنوان و توضیحات لندینگ — با padding */}
      <header className="w-full px-4 md:px-8 pt-6 pb-4 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          {landingData.title}
        </h1>
        {landingData.description && (
          <p className="text-sm text-gray-500 mt-1">
            {landingData.description}
          </p>
        )}
      </header>

      {/* ✅ بلاک‌ها — بدون padding و بدون محدودیت عرض */}
      <div className="w-full space-y-6">
        {landingData.blocks?.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </main>
  );
}