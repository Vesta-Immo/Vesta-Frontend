import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Fraunces, Manrope } from "next/font/google";
import { routing } from "@/i18n/routing";
import AuthProvider from "@/components/auth/AuthProvider";
import ThemeRegistry from "@/components/ThemeRegistry";
import { SessionResetProvider } from "@/lib/SessionResetContext";
import QueryClientProviderWrapper from "@/components/providers/QueryClientProvider";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeRegistry>
            <SessionResetProvider>
              <AuthProvider>
                <QueryClientProviderWrapper>
                  {children}
                </QueryClientProviderWrapper>
              </AuthProvider>
            </SessionResetProvider>
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
