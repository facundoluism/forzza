// next-pwa does not ship ESM-native types, so we use require() for the plugin
// itself while keeping the NextConfig type annotation fully typed.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  // Service worker is generated at build time by next-pwa; it is NOT committed.
  // In development the SW is disabled to avoid stale-cache friction.
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // Cache strategy overrides (next-pwa default is network-first for pages,
  // cache-first for static assets — aligns with our PWA requirements).
  // Custom runtimeCaching is left to next-pwa defaults here; extend as needed.
});

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl plugin — points to our request config so the plugin can inject
// the locale into RSC context without prop drilling.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Content-Security-Policy — tighten per-environment as real origins are known.
// Kept as a single string for readability; Next.js joins multi-value headers.
const CSP = [
  "default-src 'self'",
  // Next.js inline scripts (e.g. _buildManifest) need 'unsafe-inline' during
  // development. In production, replace with a nonce-based policy.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Google Fonts font files
  "font-src 'self' https://fonts.gstatic.com",
  // Supabase storage for images/avatars
  "img-src 'self' data: blob: https://*.supabase.co",
  // Supabase API, Mercado Pago SDK, PostHog, Sentry
  "connect-src 'self' https://*.supabase.co https://api.mercadopago.com https://app.posthog.com https://ingest.sentry.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Service worker scope
  "worker-src 'self'",
].join("; ");

const standaloneOutput =
  process.env["NEXT_STANDALONE"] === "true"
    ? ({ output: "standalone" } satisfies Pick<NextConfig, "output">)
    : {};

const nextConfig: NextConfig = {
  // Standalone output creates symlinks and can require Developer Mode/admin on Windows.
  // Enable it explicitly for Docker-style deploys; Vercel/local builds do not need it.
  ...standaloneOutput,

  transpilePackages: ["@forzza/ui", "@forzza/core", "@forzza/config"],

  images: {
    remotePatterns: [
      {
        // Supabase Storage — public and signed-URL buckets
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block framing entirely (also enforced by CSP frame-ancestors)
          { key: "X-Frame-Options", value: "DENY" },
          // Legacy XSS filter (belt-and-suspenders)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Limit Referer header to origin only on cross-origin requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable hardware APIs not used by this app
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Content Security Policy
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

// Compose plugins: next-intl → next-pwa → nextConfig
// Order matters: withPWA must be outermost so it wraps the webpack config last.
export default withPWA(withNextIntl(nextConfig)) as NextConfig;
