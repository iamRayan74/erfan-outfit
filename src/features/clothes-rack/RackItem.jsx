"use client";

import { motion } from "framer-motion";
import { getImageUrl } from "./rackData";

export default function RackItem({
  product,
  index,
  total,
  selectedId,
  onSelect,
}) {
  const isSelected = selectedId === product.id;
  const hasSelection = selectedId !== null;

  return (
    <motion.button
      type="button"
      className={`rack-item ${isSelected ? "is-selected" : ""}`}
      onClick={() => onSelect(isSelected ? null : product.id)}
      initial={false}
      animate={{
        scale: isSelected ? 1.15 : hasSelection ? 0.88 : 1,
        opacity: hasSelection && !isSelected ? 0.35 : 1,
        filter: hasSelection && !isSelected ? "blur(4px)" : "blur(0px)",
        zIndex: isSelected ? 30 : 10,
      }}
      whileHover={
        !hasSelection
          ? { y: -6, scale: 1.04, transition: { duration: 0.2 } }
          : {}
      }
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {/* چوب‌لباسی چوبی */}
      <div className="rack-item__hanger">
        <div className="rack-item__hook" />
        <div className="rack-item__wood" />
      </div>

      <img
        className="rack-item__image"
        src={getImageUrl(product.imageFront)}
        alt={product.name}
        draggable={false}
      />
    </motion.button>
  );
}