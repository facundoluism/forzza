import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://forzza.app", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://forzza.app/coaches", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://forzza.app/upgrade", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://forzza.app/legales/terminos", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://forzza.app/legales/privacidad", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
