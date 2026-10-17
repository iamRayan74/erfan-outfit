"use client";

import React from "react";
import DestinationHandler from "@/components/promotions/DestinationHandler";
import { fixImageUrl } from "@/lib/baseApi";

export default function HeroBannerBlock({ block }) {
  if (!block) return null;

  const imageUrl = fixImageUrl(block.image);
  const destination = block.button_link || block.more_link || block.destination;

  return (
    <DestinationHandler destination={destination} className="w-full">
      <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg group">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={block.title || "Hero Banner"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
          {block.title && (
            <h1 className="text-2xl md:text-4xl font-black mb-2">
              {block.title}
            </h1>
          )}
          {block.subtitle && (
            <p className="text-sm md:text-lg text-gray-200">{block.subtitle}</p>
          )}
          {block.button_text && (
            <span className="mt-3 inline-block self-start bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl">
              {block.button_text}
            </span>
          )}
        </div>
      </div>
    </DestinationHandler>
  );
}