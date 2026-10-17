"use client";

import React from "react";
import DestinationHandler from "../DestinationHandler";
import Skeleton from "@/components/ui/Skeleton";

export default function SmallBanner({
  banner,
  className = "h-32 md:h-50",
}) {
  // ✅ اگر banner موجود نبود، اسکلتون نمایش بده
  if (!banner) {
    return (
      <div
        className={`relative w-full ${className} rounded-xl overflow-hidden shadow-sm border border-gray-100`}
      >
        <Skeleton
          variant="rectangular"
          className="w-full h-full rounded-xl"
        />
      </div>
    );
  }

  return (
    <DestinationHandler destination={banner.destination} className="w-full">
      <div
        className={`relative w-full ${className} rounded-xl overflow-hidden shadow-sm group border border-gray-100`}
      >
        <img
          src={banner.image}
          alt={banner.title || "Small Banner"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </DestinationHandler>
  );
}