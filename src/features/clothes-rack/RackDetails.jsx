"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getImageUrl } from "./rackData";

export default function RackDetails({ product, products, onClose, onNavigate }) {
  const [showBack, setShowBack] = useState(false);

  if (!product) return null;

  const currentIndex = products.findIndex((p) => p.id === product.id);
  const prevProduct = products[currentIndex - 1];
  const nextProduct = products[currentIndex + 1];

  const currentImage =
    showBack && product.imageSide
      ? product.imageSide
      : product.imageFront;

  return (
    <motion.div
      className="rack-details-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button className="rack-details__close" onClick={onClose}>
        CLOSE ×
      </button>

      {/* فلش چپ */}
      {prevProduct && (
        <button
          className="rack-details__nav rack-details__nav--prev"
          onClick={() => onNavigate(prevProduct.id)}
        >
          ←
        </button>
      )}

      {/* فلش راست */}
      {nextProduct && (
        <button
          className="rack-details__nav rack-details__nav--next"
          onClick={() => onNavigate(nextProduct.id)}
        >
          →
        </button>
      )}

      <motion.div
        className="rack-details__content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* لباس بزرگ */}
        <div className="rack-details__visual">
          <div className="rack-details__hanger">
            <div className="rack-details__hook" />
            <div className="rack-details__wood" />
          </div>

          <img
            src={getImageUrl(currentImage)}
            alt={product.name}
            className="rack-details__image"
          />
        </div>

        {/* اطلاعات */}
        <div className="rack-details__info">
          <h2>{product.name}</h2>

          <div className="rack-details__toggle">
            <button
              className={!showBack ? "active" : ""}
              onClick={() => setShowBack(false)}
            >
              FRONT
            </button>
            {product.imageSide && (
              <button
                className={showBack ? "active" : ""}
                onClick={() => setShowBack(true)}
              >
                BACK
              </button>
            )}
          </div>

          <p className="rack-details__price">
            {Number(product.price).toLocaleString("fa-IR")} تومان
          </p>

          <button className="rack-details__cta">SEE AVAILABILITY</button>
        </div>
      </motion.div>
    </motion.div>
  );
}