import React from "react";
import Link from "next/link";
import { advantagesData } from "@/data/advantages";

export default function Advantages({
  features = advantagesData,
  className = "",
  variant = "default",
}) {
  // ---- پالت رنگی (حالت پیش‌فرض) ----
  const colorPalette = [
    {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-600",
      hoverBg: "group-hover:bg-rose-600 group-hover:border-rose-600",
      shadow: "hover:shadow-rose-500/10",
    },
    {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-600",
      hoverBg: "group-hover:bg-amber-600 group-hover:border-amber-600",
      shadow: "hover:shadow-amber-500/10",
    },
    {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-600",
      hoverBg: "group-hover:bg-emerald-600 group-hover:border-emerald-600",
      shadow: "hover:shadow-emerald-500/10",
    },
    {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-600",
      hoverBg: "group-hover:bg-indigo-600 group-hover:border-indigo-600",
      shadow: "hover:shadow-indigo-500/10",
    },
  ];

  // ---- پالت‌های تک‌رنگ ----
  const themeVariants = {
    // خاکستری ملایم
    monochrome: {
      bg: "bg-sec",
      border: "border-slate-200",
      text: "text-slate-500",
      hoverBg: "group-hover:bg-slate-800 group-hover:border-slate-800",
      shadow: "hover:shadow-slate-200/60",
    },
    // مینیمال با حاشیه، بدون پرکردن
    outline: {
      bg: "bg-transparent",
      border: "border-slate-300",
      text: "text-slate-600",
      hoverBg: "group-hover:bg-slate-900 group-hover:border-slate-900",
      shadow: "hover:shadow-slate-200/40",
    },
    // رنگ برند (تک‌رنگ)
    primary: {
      bg: "bg-primary/10",
      border: "border-primary/20",
      text: "text-primary",
      hoverBg: "group-hover:bg-primary group-hover:border-primary",
      shadow: "hover:shadow-primary/10",
    },
    // طلایی (تک‌رنگ)
    gold: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
      hoverBg: "group-hover:bg-amber-500 group-hover:border-amber-500",
      shadow: "hover:shadow-amber-500/10",
    },
  };

  const getTheme = (index) => {
    if (variant === "default") {
      return colorPalette[index % colorPalette.length];
    }
    return themeVariants[variant] || themeVariants.monochrome;
  };

  // رنگ متن/آیکون داخل کادر آیکون بر اساس variant
  const getIconHoverClass = () => {
    if (variant === "default") return "group-hover:text-white";
    return "group-hover:text-white";
  };

  return (
    <section className={`w-full py-4 ${className}`}>
      <div className="bg-white/80 border border-slate-200/80 backdrop-blur-xl rounded-3xl p-4 md:p-5 shadow-sm">
        {/* ۱. موبایل */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {features.map((item, index) => {
            const Icon = item.icon;
            const theme = getTheme(index);
            const isLastOdd =
              features.length % 2 !== 0 && index === features.length - 1;

            return (
              <Link
                key={item.id}
                href={`/advantages/${item.slug}`}
                className={`flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/60 border border-slate-100 group transition-all duration-300 hover:bg-white hover:shadow-md ${theme.shadow} ${
                  isLastOdd ? "col-span-2 justify-center" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${theme.bg} ${theme.border} border flex items-center justify-center shrink-0 transition-all duration-300 ${theme.hoverBg}`}
                >
                  {Icon && (
                    <Icon
                      className={`w-5 h-5 ${theme.text} ${getIconHoverClass()} transition-colors duration-300`}
                    />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                    {item.shortDesc || item.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ۲. دسکتاپ */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {features.map((item, index) => {
            const Icon = item.icon;
            const theme = getTheme(index);
            const isLast = index === features.length - 1;

            return (
              <React.Fragment key={item.id}>
                <Link
                  href={`/advantages/${item.slug}`}
                  className="flex items-center justify-center gap-3.5 px-3 py-1 group cursor-pointer flex-1"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${theme.bg} ${theme.border} border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${theme.hoverBg} shadow-sm`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-6 h-6 ${theme.text} ${getIconHoverClass()} transition-colors duration-300`}
                      />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium transition-colors mt-0.5 truncate">
                      {item.shortDesc || item.subtitle}
                    </span>
                  </div>
                </Link>

                {!isLast && (
                  <span className="h-8 w-px bg-slate-200/80 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}