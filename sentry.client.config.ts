import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://b35fa6033df0a1c63ab3c46a4ab77345@o4511184540073984.ingest.de.sentry.io/4511261951656016",

  sendDefaultPii: true,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,
});
