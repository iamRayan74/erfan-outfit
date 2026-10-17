"use client";

import React from "react";
import DestinationHandler from "../DestinationHandler";
import Skeleton from "@/components/ui/Skeleton";

export default function TopBanner({ data }) {
  if (!data) {
    // استفاده از h-[48px] برای اعمال دقیقاً ۴۸ پیکسل
    return <Skeleton variant="rectangular" className="w-full h-[48px] shrink-0" />;
  }

  return (
    <DestinationHandler destination={data.destination} className="w-full">
      <div className="relative w-full h-[48px] bg-slate-200/80 text-white flex items-center justify-center overflow-hidden hover:opacity-95 transition-opacity">
        {data.image && (
          <img
            src={data.image}
            alt={data.title || "Top Banner"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    </DestinationHandler>
  );
}