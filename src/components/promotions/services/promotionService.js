import api from "@/lib/baseApi";

export const promotionService = {
  getPlacements: async () => {
    try {
      const response = await api.get("/promotions/placements/");
      return response.data || response;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },
};