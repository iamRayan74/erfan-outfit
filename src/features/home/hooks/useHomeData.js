
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import {
  getAmazingProducts,
  getBestSellingProducts,
  getInstantOffers,
  getLatestProducts,
} from "../api/homeApi";

function extractData(res) {
  if (!res) return null;

  return res.data !== undefined ? res.data : res;
}

const EMPTY_LATEST = {
  targetDate: null,
  products: [],
};

const EMPTY_INSTANT_OFFERS = {
  targetDate: null,
  offers: [],
  quickAccess: [],
};

export function useHomeData() {
  const [amazingData, setAmazingData] = useState({
    targetDate: null,
    products: [],
  });

  const [bestSellingData, setBestSellingData] = useState([]);
  const [instantOffersData, setInstantOffersData] = useState(
    EMPTY_INSTANT_OFFERS
  );
  const [latestData, setLatestData] = useState(EMPTY_LATEST);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [latestPage, setLatestPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLatestLoading, setIsLatestLoading] = useState(false);
  const [error, setError] = useState(null);

  const latestRequestId = useRef(0);

  // دریافت اولیه اطلاعات به‌صورت موازی
  useEffect(() => {
    let cancelled = false;

    async function fetchInitialData() {
      setIsLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        getAmazingProducts(),
        getBestSellingProducts(),
        getInstantOffers(),
        getLatestProducts({
          category: "all",
          page: 1,
          limit: 6,
        }),
      ]);

      if (cancelled) return;

      const [amazingRes, bestSellingRes, instantRes, latestRes] =
        results;

      if (amazingRes.status === "fulfilled") {
        setAmazingData(
          extractData(amazingRes.value) ?? {
            targetDate: null,
            products: [],
          }
        );
      }

      if (bestSellingRes.status === "fulfilled") {
        const data = extractData(bestSellingRes.value);

        setBestSellingData(
          data?.products ?? (Array.isArray(data) ? data : [])
        );
      }

      if (instantRes.status === "fulfilled") {
        setInstantOffersData(
          extractData(instantRes.value) ?? EMPTY_INSTANT_OFFERS
        );
      }

      if (latestRes.status === "fulfilled") {
        const data = extractData(latestRes.value);

        setLatestData({
          targetDate: data?.targetDate ?? null,
          products: Array.isArray(data?.products)
            ? data.products
            : [],
        });
      }

      const failures = results.filter(
        (result) => result.status === "rejected"
      );

      if (failures.length === results.length) {
        setError(failures[0].reason);
      }

      setIsLoading(false);
    }

    fetchInitialData().catch((err) => {
      if (cancelled) return;

      setError(err);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // دریافت جدیدترین محصولات؛ فقط آخرین درخواست اجازه تغییر state دارد
  const fetchFilteredLatestProducts = useCallback(
    async (category = "all", page = 1) => {
      const requestId = ++latestRequestId.current;

      setIsLatestLoading(true);

      try {
        const res = await getLatestProducts({
          category,
          page,
          limit: 6,
        });

        if (requestId !== latestRequestId.current) return;

        const data = extractData(res);

        setLatestData({
          targetDate: data?.targetDate ?? null,
          products: Array.isArray(data?.products)
            ? data.products
            : [],
        });
      } catch (err) {
        if (requestId === latestRequestId.current) {
          setError(err);
        }
      } finally {
        if (requestId === latestRequestId.current) {
          setIsLatestLoading(false);
        }
      }
    },
    []
  );

  const changeCategory = useCallback(
    (categoryId) => {
      if (!categoryId) return;

      setSelectedCategory(categoryId);
      setLatestPage(1);

      fetchFilteredLatestProducts(categoryId, 1);
    },
    [fetchFilteredLatestProducts]
  );

  const changeLatestPage = useCallback(
    (page) => {
      if (!Number.isInteger(page) || page < 1) return;

      setLatestPage(page);

      fetchFilteredLatestProducts(selectedCategory, page);
    },
    [selectedCategory, fetchFilteredLatestProducts]
  );

  return {
    amazingData,
    bestSellingData,
    instantOffersData,
    latestData,
    selectedCategory,
    latestPage,
    isLoading,
    isLatestLoading,
    error,
    changeCategory,
    changeLatestPage,
  };
}
