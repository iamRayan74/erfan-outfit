"use client";

import { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import {
  XMarkIcon,
  ChevronDownIcon,
  PlusIcon,
  HandThumbUpIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

import Alert from "@/components/ui/Alert";
import { useProductContext } from "../../hooks/useProductContext";
import { productApi } from "../../api/productApi";

import "swiper/css";
import "swiper/css/pagination";

function formatToJalali(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isUserLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(
    localStorage.getItem("access_token") || localStorage.getItem("accessToken")
  );
}

export default function ProductReviews({ slug }) {
  const { submitReview, likeReview, unlikeReview } = useProductContext();

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(5);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [likingId, setLikingId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  const triggerToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 4000);
  };

  const fetchReviews = useCallback(async () => {
    if (!slug) return;
    setReviewsLoading(true);
    try {
      const res = await productApi.getProductReviews(slug);
      const items =
        res?.data?.items ||
        res?.results ||
        res?.data?.results ||
        (Array.isArray(res) ? res : []);
      setReviews(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("[FETCH REVIEWS]", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleLoadMore = () => setVisibleCount((p) => p + 5);

  // دکمه باز کردن مودال ثبت دیدگاه
  const handleOpenAddReview = () => {
    if (!isUserLoggedIn()) {
      triggerToast("برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.", "warning");
      return;
    }
    setIsAddReviewOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isUserLoggedIn()) {
      triggerToast("برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.", "warning");
      return;
    }

    if (!commentText.trim()) {
      triggerToast("لطفاً متن دیدگاه را وارد کنید.", "warning");
      return;
    }

    if (!slug) {
      triggerToast("خطا: شناسه محصول یافت نشد.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(slug, { rating: newRating, comment: commentText });
      setIsAddReviewOpen(false);
      setCommentText("");
      setNewRating(5);
      triggerToast("دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.");
      fetchReviews();
    } catch (error) {
      const errorMsg =
        error?.data?.detail ||
        error?.data?.message ||
        error?.message ||
        "خطا در ثبت دیدگاه. لطفاً دوباره تلاش کنید.";
      triggerToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (review) => {
    if (!isUserLoggedIn()) {
      triggerToast("برای ثبت لایک ابتدا وارد حساب کاربری خود شوید.", "warning");
      return;
    }

    if (!review?.id || likingId) return;

    setLikingId(review.id);
    try {
      if (review.is_liked) {
        await unlikeReview(review.id);
      } else {
        await likeReview(review.id);
      }

      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? {
                ...r,
                is_liked: !r.is_liked,
                likes_count: (r.likes_count || r.likes || 0) + (r.is_liked ? -1 : 1),
              }
            : r
        )
      );

      setSelectedReview((prev) =>
        prev && prev.id === review.id
          ? {
              ...prev,
              is_liked: !prev.is_liked,
              likes_count:
                (prev.likes_count || prev.likes || 0) + (prev.is_liked ? -1 : 1),
            }
          : prev
      );
    } catch (error) {
      const errorMsg =
        error?.data?.detail ||
        error?.data?.message ||
        error?.message ||
        "خطا در ثبت لایک.";
      triggerToast(errorMsg, "error");
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="pt-6 border-t border-rose-100/60 mb-8 relative">
      {toast.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] w-[92%] max-w-md animate-in slide-in-from-top-6 fade-in duration-300 shadow-2xl">
          <Alert
            variant={toast.variant}
            title={
              toast.variant === "error"
                ? "خطا"
                : toast.variant === "warning"
                ? "توجه"
                : "ثبت موفقیت‌آمیز"
            }
            icon={<CheckCircleIcon className="w-5 h-5" />}
            className="bg-white/95 backdrop-blur-md shadow-xl"
          >
            {toast.message}
          </Alert>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-gray-900">دیدگاه‌های کاربران</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/15 px-2.5 py-0.5 rounded-full font-faNum">
            {reviews.length} نظر
          </span>
        </div>
        <button
          type="button"
          onClick={handleOpenAddReview}
          className="text-xs font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary border border-primary/20 px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer relative z-10"
        >
          <PlusIcon className="w-4 h-4 stroke-[2.5]" />
          ثبت دیدگاه جدید
        </button>
      </div>

      {reviewsLoading ? (
        <div className="text-center py-10 text-xs text-gray-400">
          در حال دریافت نظرات...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-xs text-gray-400">
          هنوز دیدگاهی برای این محصول ثبت نشده است.
        </div>
      ) : (
        <>
          <div className="hidden lg:block space-y-4">
            <div className="space-y-3.5">
              {reviews.slice(0, visibleCount).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onToggleLike={handleToggleLike}
                  isLiking={likingId === review.id}
                />
              ))}
            </div>
            {visibleCount < reviews.length && (
              <div className="text-center pt-5">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/60 px-6 py-2.5 rounded-xl transition-all cursor-pointer active:scale-98"
                >
                  مشاهده بیشتر
                  <ChevronDownIcon className="w-4 h-4 text-primary" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Swiper
              spaceBetween={12}
              slidesPerView={1.15}
              modules={[Pagination]}
              className="w-full !pb-4"
            >
              {reviews.slice(0, 5).map((review) => (
                <SwiperSlide key={review.id}>
                  <ReviewCard
                    review={review}
                    isMobile
                    onSelect={() => setSelectedReview(review)}
                    onToggleLike={handleToggleLike}
                    isLiking={likingId === review.id}
                  />
                </SwiperSlide>
              ))}
              {reviews.length > 5 && (
                <SwiperSlide>
                  <div
                    onClick={() => setIsMobileModalOpen(true)}
                    className="h-full min-h-[190px] bg-gradient-to-br from-rose-50/80 via-surface to-rose-100/40 border border-rose-200/70 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-98 transition-transform shadow-xs"
                  >
                    <div className="w-11 h-11 rounded-full bg-white text-primary flex items-center justify-center shadow-xs border border-rose-100 mb-2.5">
                      <ChevronDownIcon className="w-5 h-5 rotate-90 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      مشاهده همه نظرات
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium mt-1 font-faNum">
                      ({reviews.length} دیدگاه ثبت شده)
                    </span>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </>
      )}

      {isAddReviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddReviewOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">ثبت دیدگاه جدید</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddReviewOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitReview}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <div className="text-center space-y-2 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/60">
                <label className="block text-xs font-bold text-gray-700">
                  امتیاز شما به این محصول
                </label>
                <div className="flex items-center justify-center gap-1.5 dir-ltr">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isSelected = (hoverRating || newRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-all duration-150 hover:scale-125 active:scale-95 cursor-pointer outline-none"
                      >
                        <StarSolidIcon
                          className={`w-7 h-7 transition-colors ${
                            isSelected
                              ? "text-amber-400 drop-shadow-xs"
                              : "text-gray-200 hover:text-amber-200"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  متن دیدگاه <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="تجربه خود از خرید و استفاده این محصول را بنویسید..."
                  className="w-full text-xs p-3.5 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  {isSubmitting ? "در حال ثبت..." : "ثبت و ارسال نظر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedReview && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedReview(null)}
          />
          <div className="relative w-full max-h-[80vh] pb-24 bg-white rounded-3xl shadow-xl z-10 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="w-full pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 font-faNum">
                دیدگاه کاربر
              </span>
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">
                    {selectedReview.user_name || selectedReview.user || "کاربر"}
                  </span>
                  {selectedReview.is_buyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckBadgeIcon className="w-3 h-3 text-emerald-600" />
                      خریدار
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-gray-400 font-faNum">
                  {formatToJalali(selectedReview.created_at || selectedReview.date)}
                </span>
              </div>
              <div className="flex items-center gap-0.5 dir-ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolidIcon
                    key={star}
                    className={`w-4 h-4 ${
                      star <= selectedReview.rating ? "text-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs font-medium text-gray-800 leading-relaxed">
                  {selectedReview.comment || selectedReview.text}
                </p>
              </div>
              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleLike(selectedReview)}
                  disabled={likingId === selectedReview.id}
                  className={`flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-xl cursor-pointer disabled:opacity-60 ${
                    selectedReview.is_liked
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-500 hover:text-emerald-600 bg-gray-100/70 hover:bg-emerald-50"
                  }`}
                >
                  <HandThumbUpIcon
                    className={`w-4 h-4 ${
                      selectedReview.is_liked ? "fill-emerald-100" : ""
                    }`}
                  />
                  <span className="text-xs font-bold font-faNum">
                    مفید بود (
                    {selectedReview.likes_count ?? selectedReview.likes ?? 0})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobileModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-rose-100 px-4 py-3.5 flex items-center justify-between shadow-2xs">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-primary" />
              همه دیدگاه‌ها
            </h3>
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(false)}
              className="w-10 h-10 rounded-2xl border flex items-center justify-center active:scale-90 transition-all duration-200 cursor-pointer pointer-events-auto shadow-xs border-gray-200 bg-gray-100/80 text-gray-800 hover:bg-gray-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isMobile
                onSelect={(selected) => {
                  setIsMobileModalOpen(false);
                  setSelectedReview(selected);
                }}
                onToggleLike={handleToggleLike}
                isLiking={likingId === review.id}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review, isMobile = false, onSelect, onToggleLike, isLiking }) {
  const userName = review.user_name || review.user || "کاربر";
  const comment = review.comment || review.text || "";
  const likes = review.likes_count ?? review.likes ?? 0;
  const isBuyer = review.is_buyer ?? review.isBuyer ?? false;
  const isLiked = review.is_liked ?? false;
  const date = formatToJalali(review.created_at || review.date);

  return (
    <div
      className={`bg-surface/70 backdrop-blur-xs border border-secondary/15 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:border-rose-200 transition-colors h-full ${
        isMobile ? "cursor-pointer active:scale-[0.99]" : ""
      }`}
      onClick={isMobile ? onSelect : undefined}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800">{userName}</span>
            {isBuyer && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                <CheckBadgeIcon className="w-3 h-3 text-emerald-600" />
                خریدار
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-gray-400 font-faNum">
            {date}
          </span>
        </div>
        <div className="flex items-center gap-0.5 mb-2.5 dir-ltr">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarSolidIcon
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= review.rating ? "text-amber-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <p
          className={`text-xs font-medium text-gray-700 leading-relaxed ${
            isMobile ? "line-clamp-2" : "line-clamp-3"
          }`}
        >
          {comment}
        </p>
      </div>
      <div className="mt-3 pt-2.5 border-t border-secondary/10 flex items-center justify-between text-gray-400 text-xs">
        {isMobile ? (
          <div className="w-full flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary flex items-center gap-1">
              مشاهده کامل نظر
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike?.(review);
              }}
              disabled={isLiking}
              className={`flex items-center gap-1 text-[11px] font-bold font-faNum transition-colors disabled:opacity-50 ${
                isLiked ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <HandThumbUpIcon className="w-3.5 h-3.5" />
              {likes}
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => onToggleLike?.(review)}
              disabled={isLiking}
              className={`flex items-center gap-1.5 transition-colors py-0.5 px-2 rounded-lg cursor-pointer disabled:opacity-50 ${
                isLiked
                  ? "text-emerald-600 bg-emerald-50/60"
                  : "hover:text-emerald-600 hover:bg-emerald-50/50"
              }`}
            >
              <HandThumbUpIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold font-faNum">{likes}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}