"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getArticles,
  getBlogCategories,
  getFeaturedArticle,
} from "../api/blogApi";

function extractData(response) {
  return response?.data !== undefined ? response.data : response;
}

export default function useBlog() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 10,
  });

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getArticles({
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
          page,
          page_size: 10,
        });

        const data = extractData(response);

        setArticles(Array.isArray(data?.items) ? data.items : []);

        setPagination({
          total: data?.total || 0,
          page: data?.page || page,
          page_size: data?.page_size || 10,
        });
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setError(error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchQuery]
  );

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);

      const response = await getBlogCategories();
      const data = extractData(response);

      setCategories(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to fetch blog categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchFeaturedArticle = useCallback(async () => {
    try {
      const response = await getFeaturedArticle();
      const data = extractData(response);

      setFeaturedArticle(data || null);
    } catch (error) {
      console.error("Failed to fetch featured article:", error);
      setFeaturedArticle(null);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedArticle();
  }, [fetchCategories, fetchFeaturedArticle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchArticles]);

  const changePage = (page) => {
    if (page < 1) return;

    const totalPages = Math.ceil(
      pagination.total / pagination.page_size
    );

    if (page > totalPages) return;

    fetchArticles(page);
  };

  return {
    articles,
    categories,
    featuredArticle,

    selectedCategory,
    setSelectedCategory,

    searchQuery,
    setSearchQuery,

    pagination,

    loading,
    categoriesLoading,
    error,

    changePage,
    refresh: () => fetchArticles(pagination.page),
  };
}