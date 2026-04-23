import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "robin-dijoux",
  project: "vesta-frontend",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Pass the auth token for source map upload
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Tunnel Sentry events through your Next.js server to prevent ad blockers
  tunnelRoute: "/sentry-tunnel",
});
