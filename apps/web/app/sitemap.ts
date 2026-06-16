import { MetadataRoute } from "next";

const BASE_URL = "https://forzza.app";

// Public indexable routes (no backoffices, no auth routes).
const publicRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/coaches", changeFrequency: "daily", priority: 0.8 },
  { path: "/upgrade", changeFrequency: "monthly", priority: 0.6 },
  { path: "/legales/terminos", changeFrequency: "monthly", priority: 0.3 },
  { path: "/legales/privacidad", changeFrequency: "monthly", priority: 0.3 },
];

// localePrefix is "as-needed": default locale (es) has no prefix, en has /en prefix.
function esUrl(path: string) {
  return `${BASE_URL}${path}`;
}

function enUrl(path: string) {
  return `${BASE_URL}/en${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: esUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        es: esUrl(path),
        en: enUrl(path),
      },
    },
  }));
}
