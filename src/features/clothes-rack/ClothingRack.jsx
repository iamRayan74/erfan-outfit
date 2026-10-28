"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRackProducts } from "./rackData";
import RackItem from "./RackItem";
import RackDetails from "./RackDetails";
import "./rack.css";

export default function ClothingRack() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getRackProducts();
        if (!cancelled) {
          setProducts(data);
          setError("");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("بارگذاری محصولات انجام نشد.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedId) || null;

  if (loading) {
    return (
      <div className="rack-page">
        <p className="rack-status">در حال بارگذاری رگال...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rack-page">
        <p className="rack-status rack-status--error">{error}</p>
      </div>
    );
  }

  return (
    <div className="rack-page">
      {/* هدر ساده مثل اصل */}
      <header className="rack-topbar">
        <span className="rack-logo">SNUG</span>
        <nav>
          <a href="#">ABOUT</a>
          <a href="#">CONTACT</a>
        </nav>
      </header>

      <main className="rack-main">
        {products.length === 0 ? (
          <p className="rack-status">محصولی برای نمایش وجود ندارد</p>
        ) : (
          <section className="rack-scene">
            {/* میله رگال */}
            <div className="rack-bar">
              <div className="rack-bar__mount rack-bar__mount--left" />
              <div className="rack-bar__pole" />
              <div className="rack-bar__mount rack-bar__mount--right" />
            </div>

            {/* لباس‌ها */}
            <div className="rack-items">
              {products.map((product, index) => (
                <RackItem
                  key={product.id}
                  product={product}
                  index={index}
                  total={products.length}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </div>

            {/* اسم محصول انتخاب‌شده */}
            <AnimatePresence>
              {selectedProduct && (
                <motion.p
                  className="rack-selected-name"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  {selectedProduct.name}
                </motion.p>
              )}
            </AnimatePresence>
          </section>
        )}
      </main>

      {/* مودال جزئیات */}
      <AnimatePresence>
        {selectedProduct && (
          <RackDetails
            product={selectedProduct}
            products={products}
            onClose={() => setSelectedId(null)}
            onNavigate={(id) => setSelectedId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}