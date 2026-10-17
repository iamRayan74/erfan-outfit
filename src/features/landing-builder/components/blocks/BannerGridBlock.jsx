"use client";

import React from "react";
import DestinationHandler from "@/components/promotions/DestinationHandler";
import { fixImageUrl } from "@/lib/baseApi";

export default function BannerGridBlock({ block }) {
  if (!block || !block.banners || block.banners.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      {block.banners.map((banner) => (
        <DestinationHandler
          key={banner.id}
          destination={banner.destination}
          className="w-full"
        >
          <div className="relative h-40 md:h-52 rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
            <img
              src={fixImageUrl(banner.image)}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {banner.title && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                <span className="text-white font-black text-lg bg-black/40 px-4 py-2 rounded-xl backdrop-blur-xs">
                  {banner.title}
                </span>
              </div>
            )}
          </div>
        </DestinationHandler>
      ))}
    </div>
  );
}