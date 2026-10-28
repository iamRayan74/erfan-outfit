
import localFont from "next/font/local";

export const mainFont = localFont({
  src: [
    { path: "./Vazir-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Vazir-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Vazir-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Vazir-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-main",
  display: "swap",
  preload: true,
});

export const faNumFont = localFont({
  src: [
    {
      path: "./Vazir-Medium-FD-UI.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-fanum",
  display: "swap",
  preload: false,
});

export const rokhFont = localFont({
  src: [
    { path: "./Rokh-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Rokh-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-rokh",
  display: "swap",
  preload: false,
});
