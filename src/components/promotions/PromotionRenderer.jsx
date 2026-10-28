
"use client";

import React from "react";
import { usePromotions } from "./PromotionContext";
import TopBanner from "./TopBanner/TopBanner";
import Stories from "./Stories/Stories";
import BannerSlider from "./BannerSlider/BannerSlider";
import SmallBanner from "./SmallBanner/SmallBanner";
import FooterBanner from "./FooterBanner/FooterBanner";
import Skeleton from "@/components/ui/Skeleton";

function PromotionSkeleton({ type, className = "" }) {
  switch (type) {
    case "topBanner":
      return (
        <Skeleton className="!h-[48px] !min-h-0 w-full !rounded-none" />
      );

    case "stories":
      return (
        <div className="flex gap-4 overflow-x-hidden py-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-2">
              <Skeleton variant="circular" className="h-16 w-16 md:h-20 md:w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      );

    case "bannerSlider":
      return (
        <Skeleton className="h-48 w-full rounded-3xl sm:h-64 md:h-96" />
      );

    case "footerBanners":
    case "footerBanner":
      return <Skeleton className="h-20 w-full rounded-2xl md:h-24" />;

    case "smallBanner":
      return (
        <div className={`grid grid-cols-2 gap-3 lg:gap-4 ${className}`}>
          <Skeleton className="h-36 w-full rounded-2xl md:h-48" />
          <Skeleton className="h-36 w-full rounded-2xl md:h-48" />
        </div>
      );

    default:
      return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
}

export default function PromotionRenderer({
  type,
  slotKey,
  className = "",
}) {
  const { promotions, isLoading } = usePromotions();

  if (isLoading || !promotions) {
    return (
      <PromotionSkeleton
        type={type}
        slotKey={slotKey}
        className={className}
      />
    );
  }

  switch (type) {
    case "topBanner":
      if (!promotions.topBanner) return null;
      return <TopBanner data={promotions.topBanner} />;

    case "stories":
      if (!promotions.stories?.length) return null;
      return <Stories items={promotions.stories} />;

    case "bannerSlider":
      if (!promotions.bannerSlider?.length) return null;
      return <BannerSlider slides={promotions.bannerSlider} />;

    case "footerBanners":
    case "footerBanner": {
      const bannerData = promotions.footerBanners;
      if (!bannerData) return null;

      const bannerList = Array.isArray(bannerData)
        ? bannerData
        : [bannerData];

      if (!bannerList.length) return null;

      return (
        <div className={`h-full w-full ${className}`}>
          {bannerList.map((banner) => (
            <FooterBanner key={banner.id} data={banner} />
          ))}
        </div>
      );
    }

    case "smallBanner": {
      let bannerData = null;
      let isFooterSlot = false;

      if (slotKey === "homeMiddle" || slotKey === "instantBanners") {
        bannerData = promotions.homeMiddleBanners;
      } else if (slotKey === "footer") {
        bannerData = promotions.footerBanners;
        isFooterSlot = true;
      } else if (slotKey) {
        bannerData =
          promotions[`${slotKey}Banners`] || promotions[slotKey];
      }

      if (!bannerData) return null;

      const bannerList = Array.isArray(bannerData)
        ? bannerData
        : [bannerData];

      if (!bannerList.length) return null;

      return (
        <div className={`grid gap-3 ${className}`}>
          {bannerList.map((banner) =>
            isFooterSlot ? (
              <FooterBanner key={banner.id} data={banner} />
            ) : (
              <SmallBanner key={banner.id} banner={banner} />
            )
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
