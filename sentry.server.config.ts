import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://b35fa6033df0a1c63ab3c46a4ab77345@o4511184540073984.ingest.de.sentry.io/4511261951656016",

  // Adds request headers and IP for users
  sendDefaultPii: true,

  // Capture 100% in dev, 10% in production
  // Adjust based on your traffic volume
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,
});
