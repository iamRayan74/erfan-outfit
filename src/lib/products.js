
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getImageUrl(image) {
  if (!image) return "/images/product-placeholder.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/products/`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت محصولات: ${response.status}`);
  }

  const data = await response.json();

  const products = Array.isArray(data)
    ? data
    : data.results || [];

  return products.filter(
    (product) => product.is_active !== false
  );
}
