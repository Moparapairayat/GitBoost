import { MetadataRoute } from "next";
import { APP_URL, ROUTES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: APP_URL, priority: 1, changeFrequency: "daily" as const },
    { url: `${APP_URL}${ROUTES.EXPLORE}`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${APP_URL}${ROUTES.TRENDING}`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${APP_URL}${ROUTES.LATEST}`, priority: 0.8, changeFrequency: "hourly" as const },
    { url: `${APP_URL}${ROUTES.SEARCH}`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${APP_URL}${ROUTES.PRICING}`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${APP_URL}${ROUTES.SIGN_IN}`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return staticPages.map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
