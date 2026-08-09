import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Afia",
    short_name: "Afia",
    description: "A self-help tool for health anxiety, grounded in CBT and ERP.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#2F6E7A",
    icons: [
      {
        src: "/Images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/Images/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
