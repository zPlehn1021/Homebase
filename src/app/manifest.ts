import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Homebase — Home Maintenance Planner",
    short_name: "Homebase",
    description:
      "Your personalized home maintenance plan. Seasonal reminders, cost tracking, and smart scheduling.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f9f7f4",
    theme_color: "#5e6c51",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
