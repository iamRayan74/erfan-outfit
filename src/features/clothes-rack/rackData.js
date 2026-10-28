
import { productApi } from "@/features/products/api/productApi";

function normalizeProduct(product, index) {
  return {
    id: product.id ?? product.pk ?? index,
    name: product.name ?? product.title ?? "محصول بدون نام",
    price: product.price ?? product.final_price ?? 0,
    description: product.description ?? "",
    imageFront:
      product.image_front ??
      product.front_image ??
      product.main_image ??
      product.image ??
      product.thumbnail ??
      null,
    imageSide:
      product.image_side ??
      product.side_image ??
      null,
    isActive: product.is_active !== false,
    rackOrder: product.rack_order ?? index,
  };
}

export function getImageUrl(image) {
  if (!image) return "/images/product-placeholder.png";

  // اگر API آبجکت تصویر برگرداند
  if (typeof image === "object") {
    image = image.url ?? image.image ?? image.src;
  }

  if (!image || typeof image !== "string") {
    return "/images/product-placeholder.png";
  }

  // تصاویر کامل یا مسیرهای absolute
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // استفاده از آدرس اصلی Django که در baseApi تنظیم شده
  const apiBaseURL = productApiBaseURL();

  return `${apiBaseURL}/${image.replace(/^\//, "")}`;
}

function productApiBaseURL() {
  // اگر تصاویر به‌صورت مسیر نسبی از Django برگردند،
  // آدرس پایه را از متغیر محیطی می‌گیریم.
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
}

export async function getRackProducts() {
  const response = await productApi.getProducts();

  // Axios معمولاً داده را داخل response.data برمی‌گرداند
  const payload = response?.data ?? response;

  // پشتیبانی از پاسخ آرایه‌ای و صفحه‌بندی‌شده
  const items = Array.isArray(payload)
    ? payload
    : payload?.results ??
      payload?.data?.results ??
      payload?.data ??
      [];

  if (!Array.isArray(items)) {
    console.error("فرمت پاسخ محصولات قابل شناسایی نیست:", payload);
    throw new Error("فرمت پاسخ API محصولات معتبر نیست.");
  }

  console.log("[Rack] تعداد محصولات دریافتی:", items.length);
  console.log("[Rack] نمونه محصول:", items[0]);

  return items
    .map(normalizeProduct)
    .filter((product) => product.isActive && product.imageFront)
    .sort((a, b) => a.rackOrder - b.rackOrder);
}
