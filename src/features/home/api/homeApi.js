import baseApi from "@/lib/baseApi";

/**
 * دریافت محصولات شگفت‌انگیز
 */
export const getAmazingProducts = async (params = {}) => {
  return await baseApi.get(
    "/catalog/products/amazing-offers/",
    {
      params: {
        limit: 8,
        ...params,
      },
    }
  );
};

/**
 * دریافت پرفروش‌ترین محصولات
 */
export const getBestSellingProducts = async (
  params = {}
) => {
  return await baseApi.get(
    "/catalog/products/bestsellers/",
    {
      params: {
        limit: 4,
        ...params,
      },
    }
  );
};

/**
 * دریافت پیشنهادهای لحظه‌ای
 */
export const getInstantOffers = async () => {
  return await baseApi.get(
    "/catalog/products/instant-offers/"
  );
};

/**
 * دریافت جدیدترین محصولات
 *
 * category:
 * all
 * men-clothing
 * women-clothing
 * bags-shoes
 * kids-clothing
 * accessories
 */
export const getLatestProducts = async (
  params = {}
) => {
  return await baseApi.get(
    "/catalog/products/latest/",
    {
      params: {
        category: "all",
        page: 1,
        limit: 6,
        ...params,
      },
    }
  );
};