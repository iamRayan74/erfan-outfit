"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import SocialLinks from "../SocialLinks";
import Logo from "@/components/ui/Logo";
import Advantages from "@/features/advantages/components/Advantages";
import PromotionRenderer from "@/components/promotions/PromotionRenderer";
import mapImage from "@/assets/images/map.webp";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      dir="rtl"
      className="w-full pt-8 mb-16 lg:mb-0 pb-12 select-none text-slate-800"
    >
      <div className="mx-auto w-full px-4 sm:px-8 flex flex-col items-center">
        {/* کادر اصلی فوتر */}
        <div className="relative z-10 w-full rounded-[2.5rem] bg-slate-50/90 border border-slate-200/80 p-4 sm:p-8 shadow-sm backdrop-blur-md space-y-6">
          {/* ================= ردیف اول: لینک‌ها + اطلاعات تماس + درباره ما و نقشه ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* سمت راست: ۳ ستون لینک جدا شده با دیوایدر (۵ ستون از ۱۲) */}
            <div className="lg:col-span-5 mt-2 p-2 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
                {/* ستون ۱: راهنمای خرید */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    <h3 className="text-sm font-black text-slate-900">
                      راهنمای خرید
                    </h3>
                  </div>
                  <ul className="space-y-3 text-xs font-bold text-slate-600">
                    <li>
                      <Link
                        href="/faq?category=orders"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>ثبت سفارش</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq?category=shipping"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>نحوه ارسال</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq?category=payment"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>شیوه‌های پرداخت</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* دیوایدر عمودی ۱ */}
                <div className="hidden sm:flex items-center justify-center">
                  <div className="w-px h-full min-h-[100px] bg-slate-200 shrink-0" />
                </div>

                {/* ستون ۲: دسترسی سریع */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    <h3 className="text-sm font-black text-slate-900">
                      دسترسی سریع
                    </h3>
                  </div>
                  <ul className="space-y-3 text-xs font-bold text-slate-600">
                    <li>
                      <Link
                        href="/contact"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>تماس با ما</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>فروشگاه</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>وبلاگ</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* دیوایدر عمودی ۲ */}
                <div className="hidden sm:flex items-center justify-center">
                  <div className="w-px h-full min-h-[100px] bg-slate-200 shrink-0" />
                </div>

                {/* ستون ۳: خدمات مشتریان */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    <h3 className="text-sm font-black text-slate-900">
                      خدمات مشتریان
                    </h3>
                  </div>
                  <ul className="space-y-3 text-xs font-bold text-slate-600">
                    <li>
                      <Link
                        href="/faq"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>سوالات متداول</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy-policy"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>حریم خصوصی</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq?category=returns"
                        className="flex items-center justify-between hover:text-primary transition-colors cursor-pointer group"
                      >
                        <span>بازگشت وجه و تعویض</span>
                        <ChevronLeftIcon className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* وسط: اطلاعات تماس (۳ ستون از ۱۲) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm space-y-6">
              <div className="flex items-center justify-start gap-2">
                <PhoneIcon className="text-secondary w-3.5 h-3.5" />
                <h3 className="text-sm font-rokh font-black pt-2 text-primary">
                  اطلاعات تماس
                </h3>
              </div>

              <div className="space-y-3 text-right">
                <a
                  href="tel:02155678910"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-xl border border-secondary/8 bg-gray-200/60 backdrop-blur-md shadow-lg shadow-secondary-500/10 flex items-center justify-center font-bold">
                    <PhoneIcon className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 tabular-nums">
                      ۰۲۱-۵۵۶۷۸۹۱۰
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      پشتیبانی و تماس با ما
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl border border-secondary/8 bg-gray-200/60 backdrop-blur-md shadow-lg shadow-secondary-500/10 flex items-center justify-center font-bold">
                    <MapPinIcon className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">
                      تهران، سعادت‌آباد، کوچه ۵
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      آدرس فروشگاه
                    </p>
                  </div>
                </div>

                <a
                  href="mailto:info@site.com"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-xl border border-secondary/8 bg-gray-200/60 backdrop-blur-md shadow-lg shadow-secondary-500/10 flex items-center justify-center font-bold">
                    <EnvelopeIcon className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">
                      info@site.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      ایمیل پشتیبانی
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* سمت چپ: درباره ما + نقشه (۴ ستون از ۱۲) */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
              {/* بخش توضیحات برند */}
              <div className="flex-1 space-y-2 text-right">
                <div className="flex items-center gap-2">
                  <Logo width={110} height={32} />
                </div>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                  آنلاین مد، مرجع خرید لباس و محصولات مد با تضمین اصالت کالا،
                  کیفیت بالا و ارسال سریع به سراسر کشور.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-rose-900 text-white text-[11px] font-bold hover:bg-rose-800 transition-colors"
                >
                  درباره ما
                  <ChevronLeftIcon className="w-3 h-3" />
                </Link>
              </div>

              {/*  کارت نقشه با افکت grayscale → رنگی در هاور */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=38.613118,48.1210355"
                target="_blank"
                rel="noopener noreferrer"
                className="w-36 h-36 rounded-2xl overflow-hidden border border-slate-200 relative shrink-0 group cursor-pointer block"
              >
                <Image
                  src={mapImage}
                  alt="موقعیت روی نقشه"
                  fill
                  sizes="144px"
                  className="object-cover grayscale brightness-90 contrast-75 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 flex flex-col items-center justify-end p-1.5">
                  <span className="w-full py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-bold text-slate-800 shadow-sm flex items-center justify-center gap-1 group-hover:bg-white transition-colors">
                    <MapPinIcon className="w-3 h-3 text-rose-600" />
                    مشاهده موقعیت
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* ================= ردیف دوم: Advantages ================= */}
          <Advantages className="!py-0" />

          {/* ================= ردیف سوم: شبکه‌های اجتماعی + نمادها + بنر تبلیغاتی ================= */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-0 items-center">
            <div className="lg:col-span-4 flex items-center justify-between relative overflow-hidden">
              <div className="w-full h-full rounded-xl overflow-hidden shrink-0 relative">
                <PromotionRenderer type="footerBanners" />
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center lg:col-span-1">
              <div className="w-px h-16 bg-slate-200 shrink-0" />
            </div>

            <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] font-black text-slate-700">
                نماد اعتماد و مجوزها
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center"
                  >
                    <span className="text-[9px] font-bold text-slate-400">
                      نماد {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center lg:col-span-1">
              <div className="w-px h-16 bg-slate-200 shrink-0" />
            </div>

            <div className="lg:col-span-3 flex flex-col items-center justify-between gap-y-1.5">
              <div className="text-center">
                <h4 className="text-xs font-black text-slate-800">
                  ما را دنبال کنید
                </h4>
                <p className="text-[10px] font-medium text-slate-400">
                  در شبکه‌های اجتماعی همراه ما باشید
                </p>
              </div>
              <SocialLinks />
            </div>
          </div>

          {/* ================= ردیف چهارم: کپی‌رایت ================= */}
          <div className="space-y-3">
            <div className="w-full h-px bg-slate-200 my-2" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold text-slate-500 px-2">
              <p>
                © کلیه حقوق مادی و معنوی برای این سایت محفوظ می‌باشد.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/track-order"
                  className="hover:text-slate-900 transition-colors"
                >
                  پیگیری سفارش
                </Link>
                <span>|</span>
                <Link
                  href="/terms"
                  className="hover:text-slate-900 transition-colors"
                >
                  شرایط و ضوابط
                </Link>
              </div>
            </div>
          </div>

          {/* دکمه بازگشت به بالا */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-lg hover:bg-slate-800 transition-all duration-300 hover:scale-105"
            >
              <span>بازگشت به بالا</span>
              <ChevronUpIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}