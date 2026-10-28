
import baseApi from "@/lib/baseApi";

export const getAmazingProducts = (params = {}) =>
  baseApi.get("/catalog/products/amazing-offers/", {
    params: {
      limit: 8,
      ...params,
    },
  });

export const getBestSellingProducts = (params = {}) =>
  baseApi.get("/catalog/products/bestsellers/", {
    params: {
      limit: 4,
      ...params,
    },
  });

export const getInstantOffers = () =>
  baseApi.get("/catalog/products/instant-offers/");

export const getLatestProducts = (params = {}) =>
  baseApi.get("/catalog/products/latest/", {
    params: {
      category: "all",
      page: 1,
      limit: 6,
      ...params,
    },
  });
