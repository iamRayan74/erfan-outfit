"use client";

import { createContext, useState, useCallback, useEffect } from "react";
import { productApi } from "../api/productApi";

export const ProductContext = createContext(null);

// کلیدهای ذخیره‌سازی در LocalStorage
const CACHE_KEYS = {
  CATEGORIES: "app_cache_categories",
  COLLECTIONS: "app_cache_collections",
};

// مدت زمان اعتبار کَش (۱ ساعت)
const CACHE_TTL = 60 * 60 * 1000;

// تابع کمکی برای استخراج متنی و امن پیام خطا
function getErrorMessage(err, fallbackMessage) {
  if (typeof err === "string") return err;
  if (!err) return fallbackMessage;

  if (err.message && err.message !== "خطایی در برقراری ارتباط رخ داد.") {
    return err.message;
  }

  if (err.response?.data?.detail) {
    return err.response.data.detail;
  }

  if (err.status === undefined && (!err.response || err.code === "ERR_NETWORK")) {
    return "ارتباط با سرور برقرار نشد. لطفاً از اتصال اینترنت یا فعال بودن سرور مطمئن شوید.";
  }

  return fallbackMessage;
}

// تابع کمکی برای استخراج امن داده پاسخ API
function extractData(res) {
  if (!res) return null;
  return res.data !== undefined ? res.data : res;
}

export function ProductProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    category: "",
    colors: "",
    sizes: "",
    search: "",
    ordering: "",
    price_min: "",
    price_max: "",
    season: "",
    style: "",
    gender: "",
    featured: false,
  });

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // --- دریافت دسته‌بندی‌ها با مکانیزم Caching ---
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEYS.CATEGORIES);
      if (cachedData && !forceRefresh) {
        const { data, timestamp } = JSON.parse(cachedData);
        setCategories(data);
        setCategoriesLoading(false);

        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }

      const res = await productApi.getCategories();
      const data = extractData(res);
      const list = Array.isArray(data) ? data : data?.results || [];

      if (list.length > 0) {
        setCategories(list);
        localStorage.setItem(
          CACHE_KEYS.CATEGORIES,
          JSON.stringify({ data: list, timestamp: Date.now() })
        );
      }
      return list;
    } catch (err) {
      console.error("خطا در دریافت دسته‌بندی‌ها:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // --- دریافت کالکشن‌ها با مکانیزم Caching ---
  const fetchCollections = useCallback(async (forceRefresh = false) => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEYS.COLLECTIONS);
      if (cachedData && !forceRefresh) {
        const { data, timestamp } = JSON.parse(cachedData);
        setCollections(data);

        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }

      const res = await productApi.getMegamenuCollections();
      const data = extractData(res);
      const list = Array.isArray(data) ? data : data?.results || [];

      if (list.length > 0) {
        setCollections(list);
        localStorage.setItem(
          CACHE_KEYS.COLLECTIONS,
          JSON.stringify({ data: list, timestamp: Date.now() })
        );
      }
      return list;
    } catch (err) {
      console.error("خطا در دریافت کالکشن‌ها:", err);
    }
  }, []);

  // --- دریافت محصولات ---
  const fetchProducts = useCallback(async (targetFilters) => {
    const isFirstPage = !targetFilters.page || Number(targetFilters.page) === 1;

    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const cleanParams = {};
      Object.keys(targetFilters).forEach((key) => {
        const val = targetFilters[key];
        if (val !== "" && val !== null && val !== undefined && val !== false) {
          cleanParams[key] = val;
        }
      });

      const res = await productApi.getProducts(cleanParams);
      const data = extractData(res);

      if (Array.isArray(data)) {
        setProducts(data);
        setProductsCount(data.length);
        setHasMore(false);
      } else if (data && typeof data === "object") {
        const results = data.results || [];
        const count = data.count || 0;
        setProductsCount(count);

        if (isFirstPage) {
          setProducts(results);
        } else {
          setProducts((prev) => [...prev, ...results]);
        }

        setHasMore(Boolean(data.next));
      } else {
        if (isFirstPage) setProducts([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("خطا در دریافت لیست محصولات:", err);
      const msg = getErrorMessage(err, "خطا در دریافت لیست محصولات");
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => {
        const isPageOnlyChange =
          Object.keys(newFilters).length === 1 && "page" in newFilters;
        const updatedPage = isPageOnlyChange ? newFilters.page || 1 : 1;

        const nextFilters = {
          ...prev,
          ...newFilters,
          page: updatedPage,
        };

        fetchProducts(nextFilters);
        return nextFilters;
      });
    },
    [fetchProducts]
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      updateFilters({ page: (filters.page || 1) + 1 });
    }
  }, [loadingMore, loading, hasMore, filters.page, updateFilters]);

  const resetFilters = useCallback(() => {
    const initialFilters = {
      page: 1,
      category: "",
      colors: "",
      sizes: "",
      search: "",
      ordering: "",
      price_min: "",
      price_max: "",
      season: "",
      style: "",
      gender: "",
      featured: false,
    };
    setFilters(initialFilters);
    fetchProducts(initialFilters);
  }, [fetchProducts]);

  const fetchProductDetail = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.getProductBySlug(slug);
      const data = extractData(res);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err, "خطا در دریافت جزئیات محصول");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ثبت دیدگاه
  const submitReview = async (slug, payload) => {
    if (!slug) throw new Error("شناسه محصول (slug) یافت نشد.");
    return await productApi.submitProductReview(slug, payload);
  };

  // ✅ ثبت پرسش
  const submitQuestion = async (slug, payload) => {
    if (!slug) throw new Error("شناسه محصول (slug) یافت نشد.");
    return await productApi.submitProductQuestion(slug, payload);
  };

  // ✅ لایک نظر
  const likeReview = async (reviewId) => {
    if (!reviewId) throw new Error("شناسه نظر یافت نشد.");
    return await productApi.likeReview(reviewId);
  };

  // ✅ دیسلایک نظر
  const unlikeReview = async (reviewId) => {
    if (!reviewId) throw new Error("شناسه نظر یافت نشد.");
    return await productApi.unlikeReview(reviewId);
  };

  useEffect(() => {
    fetchCategories();
    fetchCollections();
    fetchProducts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProductContext.Provider
      value={{
        categories,
        collections,
        products,
        productsCount,
        selectedProduct,
        filters,
        loading,
        categoriesLoading,
        loadingMore,
        hasMore,
        error,
        fetchCategories,
        fetchCollections,
        fetchProducts,
        fetchProductDetail,
        updateFilters,
        resetFilters,
        loadMore,
        submitReview,
        submitQuestion,
        likeReview,
        unlikeReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}