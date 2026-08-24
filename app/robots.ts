import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://afia.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/pricing"],
        disallow: [
          "/home",
          "/plan",
          "/journal",
          "/progress",
          "/calm-tool",
          "/calm",
          "/settings",
          "/subscription",
          "/screener",
          "/admin",
          "/api",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
