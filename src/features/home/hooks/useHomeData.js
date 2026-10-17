import { useState, useEffect, useCallback } from "react";

import {
  getAmazingProducts,
  getBestSellingProducts,
  getInstantOffers,
  getLatestProducts,
} from "../api/homeApi";

function extractData(res) {
  if (!res) return null;

  return res.data !== undefined
    ? res.data
    : res;
}

export function useHomeData() {
  const [amazingData, setAmazingData] = useState({
    targetDate: null,
    products: [],
  });

  const [bestSellingData, setBestSellingData] =
    useState([]);

  const [instantOffersData, setInstantOffersData] =
    useState({
      targetDate: null,
      offers: [],
      quickAccess: [],
    });

  const [latestData, setLatestData] = useState({
    targetDate: null,
    products: [],
  });

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [latestPage, setLatestPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLatestLoading, setIsLatestLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // =========================================================
  // Initial data
  // =========================================================

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const results =
          await Promise.allSettled([
            getAmazingProducts(),
            getBestSellingProducts(),
            getInstantOffers(),
            getLatestProducts({
              category: "all",
              page: 1,
              limit: 6,
            }),
          ]);

        const [
          amazingRes,
          bestSellingRes,
          instantRes,
          latestRes,
        ] = results;

        // Amazing
        if (
          amazingRes.status === "fulfilled"
        ) {
          const data =
            extractData(amazingRes.value);

          setAmazingData(
            data || {
              targetDate: null,
              products: [],
            }
          );
        }

        // Best Selling
        if (
          bestSellingRes.status === "fulfilled"
        ) {
          const data =
            extractData(bestSellingRes.value);

          setBestSellingData(
            data?.products ||
              (Array.isArray(data)
                ? data
                : [])
          );
        }

        // Instant Offers
        if (
          instantRes.status === "fulfilled"
        ) {
          const data =
            extractData(instantRes.value);

          setInstantOffersData(
            data || {
              targetDate: null,
              offers: [],
              quickAccess: [],
            }
          );
        }

        // Latest
        if (
          latestRes.status === "fulfilled"
        ) {
          const data =
            extractData(latestRes.value);

          setLatestData({
            targetDate:
              data?.targetDate || null,

            products:
              Array.isArray(data?.products)
                ? data.products
                : [],
          });
        }

        const allRejected =
          results.every(
            (result) =>
              result.status ===
              "rejected"
          );

        if (allRejected) {
          setError(
            results[0].reason
          );
        }
      } catch (err) {
        console.error(
          "خطا در دریافت اطلاعات صفحه اصلی:",
          err
        );

        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // =========================================================
  // Latest products by category
  // =========================================================

  const fetchFilteredLatestProducts =
    useCallback(
      async (
        category = "all",
        page = 1
      ) => {
        try {
          setIsLatestLoading(true);

          const res =
            await getLatestProducts({
              category,
              page,
              limit: 6,
            });

          const data =
            extractData(res);

          console.log(
            "Latest Products:",
            {
              category,
              page,
              data,
            }
          );

          setLatestData({
            targetDate:
              data?.targetDate || null,

            products:
              Array.isArray(
                data?.products
              )
                ? data.products
                : [],
          });
        } catch (err) {
          console.error(
            "خطا در دریافت جدیدترین محصولات:",
            err
          );

          // هنگام خطا state قبلی را حفظ می‌کنیم
        } finally {
          setIsLatestLoading(false);
        }
      },
      []
    );

  // =========================================================
  // Change category
  // =========================================================

  const changeCategory =
    useCallback(
      (categoryId) => {
        if (!categoryId) return;

        setSelectedCategory(
          categoryId
        );

        setLatestPage(1);

        fetchFilteredLatestProducts(
          categoryId,
          1
        );
      },
      [
        fetchFilteredLatestProducts,
      ]
    );

  // =========================================================
  // Change page
  // =========================================================

  const changeLatestPage =
    useCallback(
      (page) => {
        if (!page || page < 1) {
          return;
        }

        setLatestPage(page);

        fetchFilteredLatestProducts(
          selectedCategory,
          page
        );
      },
      [
        selectedCategory,
        fetchFilteredLatestProducts,
      ]
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