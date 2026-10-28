"use client";

import DestinationHandler from "../DestinationHandler";
import Skeleton from "@/components/ui/Skeleton";

export default function TopBanner({ data }) {
  if (!data) {
    return (
      <Skeleton
        variant="rectangular"
        className="!h-[48px] !min-h-[48px] !max-h-[48px] w-full !rounded-none shrink-0"
      />
    );
  }

  return (
    <DestinationHandler
      destination={data.destination}
      className="block w-full"
    >
      <div className="relative h-[48px] min-h-[48px] max-h-[48px] w-full overflow-hidden bg-slate-200/80 text-white">
        {data.image && (
          <img
            src={data.image}
            alt={data.title || "Top Banner"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
    </DestinationHandler>
  );
}