import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/tasks",
        "/schedule",
        "/costs",
        "/settings",
        "/onboarding",
        "/api/",
      ],
    },
    sitemap: "https://homebase.app/sitemap.xml",
  };
}
