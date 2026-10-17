import baseApi from "@/lib/baseApi";

export const landingApi = {
  getLandingBySlug: async (slug) => {
    return await baseApi.get(`/promotions/landings/${encodeURIComponent(slug)}/`);
  },
};