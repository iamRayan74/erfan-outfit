"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  UserIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CameraIcon,
  SparklesIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import Breadcrumb from "@/components/common/Breadcrumb/Breadcrumb";
import Button from "@/components/ui/Button";
import UserProfileHeader from "@/features/profile/components/UserProfileHeader";
import UserProfileNavigation from "@/features/profile/components/UserProfileNavigation";
import UserOrdersList from "@/features/profile/components/UserOrdersList";
import UserAddresses from "@/features/profile/components/UserAddresses";

// اسلایدر علاقه‌مندی که زیر پروفایل نمایش داده می‌شود
import WishlistProductsSlider from "@/features/profile/components/WishlistProductsSlider";

// لیست علاقه‌مندی که داخل تب علاقه‌مندی‌ها نمایش داده می‌شود
import WishlistProducts from "@/features/profile/components/WishlistProducts";

import UserProfileEditModal from "@/features/profile/components/UserProfileEditModal";
import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import { useProfileContext } from "@/features/profile/hooks/useProfileContext";
import { mockUserData } from "@/features/profile/mocks/userProfileData";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function resolveAvatar(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

function AuthenticatedProfileView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get("tab") || "orders";
  const activeTab = currentTabFromUrl;

  const {
    profile,
    fetchProfile,
    loading: profileLoading,
  } = useProfileContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleTabChange = useCallback(
    (newTab) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("tab", newTab);

      router.push(`/profile?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const breadcrumbItems = [
    { label: "صفحه اصلی", href: "/" },
    { label: "حساب کاربری" },
  ];

  const avatarUrl = resolveAvatar(profile?.avatar);

  return (
    <div className="text-slate-800 text-sm pb-20 lg:pb-12 min-h-screen">
      <div className="container mx-auto px-4 py-4 space-y-8 max-w-6xl">
        <Breadcrumb
          items={breadcrumbItems}
          isCustomPosition={true}
        />

        {/* Profile + Navigation + Tab Content */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <UserProfileHeader
              user={profile}
              onEditClick={() => setIsEditModalOpen(true)}
            />

            <UserProfileNavigation
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Orders */}
            {activeTab === "orders" && (
              <UserOrdersList orders={mockUserData.orders} />
            )}

            {/* Addresses */}
            {activeTab === "addresses" && (
              <UserAddresses addresses={mockUserData.addresses} />
            )}

            {/* Favorites */}
            {activeTab === "favorites" && (
              <WishlistProducts />
            )}

            {/* Account */}
            {activeTab === "account" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                {/* Account Header */}
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg shadow-secondary-500/10">
                      <UserIcon className="w-5 h-5" />
                    </div>

                    <h3 className="font-rokh font-bold text-slate-900 text-lg">
                      اطلاعات شخصی
                    </h3>
                  </div>

                  <Button
                    variant="gradient"
                    size="md"
                    icon={PencilIcon}
                    iconPosition="left"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    ویرایش اطلاعات
                  </Button>
                </div>

                {profileLoading ? (
                  <div className="text-xs text-slate-400 py-8 text-center">
                    در حال دریافت اطلاعات...
                  </div>
                ) : (
                  <>
                    {/* Profile Summary */}
                    <div className="p-6 bg-gradient-to-l from-indigo-50/80 via-slate-50/40 to-white rounded-3xl border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative shrink-0">
                          <div className="w-20 h-20 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center shadow-md border border-slate-800">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={
                                  profile?.first_name || "کاربر"
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-10 h-10 text-indigo-300" />
                            )}
                          </div>

                          <button
                            onClick={() =>
                              setIsEditModalOpen(true)
                            }
                            className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-full shadow border border-slate-100 flex items-center justify-center text-indigo-600 hover:scale-105 transition-transform cursor-pointer"
                          >
                            <CameraIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-lg">
                            {profile?.first_name
                              ? `${profile.first_name} ${
                                  profile?.last_name || ""
                                }`
                              : "کاربر"}
                          </h4>

                          <p className="text-xs text-slate-400">
                            کاربر عزیز، اطلاعات حساب شما در این بخش
                            نمایش داده می‌شود.
                          </p>

                          <button
                            onClick={() =>
                              setIsEditModalOpen(true)
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-100 transition-colors mt-1 cursor-pointer"
                          >
                            <CameraIcon className="w-3 h-3" />
                            <span>تغییر تصویر</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-right md:text-left space-y-1.5 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <div className="flex items-center md:justify-end gap-1.5 text-indigo-600 font-bold text-xs">
                          <SparklesIcon className="w-4 h-4" />

                          <span>
                            به حساب کاربری خود خوش آمدید!
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                          می‌توانید اطلاعات شخصی خود را ویرایش کنید
                          و از امکانات بیشتری در سایت استفاده نمایید.
                        </p>
                      </div>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-indigo-50/60 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg shadow-secondary-500/10">
                          <PhoneIcon className="w-4 h-4" />
                        </div>

                        <div className="text-left space-y-1">
                          <span className="text-[11px] text-slate-400 block font-medium">
                            شماره موبایل
                          </span>

                          <span className="font-bold font-fanum text-slate-900 text-sm dir-ltr inline-block">
                            {profile?.phone ||
                              profile?.phone_number ||
                              "-"}
                          </span>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-indigo-50/60 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full border border-[#E0DCD3] bg-gray-200/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg shadow-secondary-500/10">
                          <EnvelopeIcon className="w-4 h-4" />
                        </div>

                        <div className="text-left space-y-1">
                          <span className="text-[11px] text-slate-400 block font-medium">
                            ایمیل
                          </span>

                          <span className="font-bold text-slate-900 text-sm dir-ltr inline-block">
                            {profile?.email || "-"}
                          </span>
                        </div>
                      </div>

                      {/* Birth Date */}
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-indigo-50/60 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg shadow-secondary-500/10">
                          <CalendarIcon className="w-4 h-4" />
                        </div>

                        <div className="text-left space-y-1">
                          <span className="text-[11px] text-slate-400 block font-medium">
                            تاریخ تولد
                          </span>

                          <span className="font-bold font-fanum text-slate-900 text-sm dir-ltr inline-block">
                            {profile?.birth_date || "-"}
                          </span>
                        </div>
                      </div>

                      {/* National ID */}
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-indigo-50/60 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg shadow-secondary-500/10">
                          <UserIcon className="w-4 h-4" />
                        </div>

                        <div className="text-left font-fanum space-y-1">
                          <span className="text-[11px] text-slate-400 block font-medium">
                            کد ملی
                          </span>

                          <span className="font-bold text-slate-900 text-sm dir-ltr inline-block">
                            {profile?.national_id || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <Link
                      href="/contact"
                      className="p-4 bg-[#F8FAFC] rounded-2xl border border-indigo-50/60 flex items-center justify-between hover:bg-slate-100/50 transition-colors cursor-pointer block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-secondary/10 bg-gray-200/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-lg shadow-secondary-500/10">
                          <ShieldCheckIcon className="w-5 h-5" />
                        </div>

                        <div className="space-y-0.5">
                          <h5 className="font-bold text-slate-800 text-xs">
                            اطلاعات تکمیلی
                          </h5>

                          <p className="text-[11px] text-slate-400">
                            در صورت نیاز به تغییر سایر اطلاعات، با
                            پشتیبانی سایت تماس بگیرید.
                          </p>
                        </div>
                      </div>

                      <ChevronLeftIcon className="w-4 h-4 text-slate-400" />
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 
          Wishlist Slider
          این کامپوننت عمداً خارج از تب‌ها قرار گرفته
          و همیشه زیر بخش اصلی پروفایل نمایش داده می‌شود.
        */}
        <div className="w-full">
          <WishlistProductsSlider />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <UserProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const {
    isAuthenticated,
    loading: authLoading,
    openAuthModal,
    isAuthModalOpen,
    closeAuthModal,
  } = useAuthContext();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [
    authLoading,
    isAuthenticated,
    openAuthModal,
  ]);

  // بستن مودال و هدایت به صفحه قبلی یا صفحه اصلی
  const handleCloseAuthModal = () => {
    closeAuthModal();

    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F6F8FC]"
        dir="rtl"
      >
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />

        <p className="text-slate-500 font-bold text-sm">
          در حال بررسی حساب کاربری...
        </p>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
        />
      </div>
    );
  }

  return (
    <ProfileProvider>
      <AuthenticatedProfileView />
    </ProfileProvider>
  );
}