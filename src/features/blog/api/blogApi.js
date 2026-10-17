import baseApi from "@/lib/baseApi";

export const getArticles = async (params = {}) => {
  return await baseApi.get("/blog/articles/", {
    params: {
      page: 1,
      page_size: 10,
      ...params,
    },
  });
};

export const getBlogCategories = async () => {
  return await baseApi.get("/blog/categories/");
};

export const getFeaturedArticle = async () => {
  return await baseApi.get("/blog/articles/featured/");
};

export const getArticleBySlug = async (slug) => {
  return await baseApi.get(
    `/blog/articles/${encodeURIComponent(slug)}/`
  );
};

export const registerArticleView = async (slug) => {
  return await baseApi.post(
    `/blog/articles/${encodeURIComponent(slug)}/view/`,
    {}
  );
};