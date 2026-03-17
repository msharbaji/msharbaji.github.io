import type { Metadata } from "next";
import { Syne, DM_Sans, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mohamad Alsharbaji | Platform Engineer",
    template: "%s | Mohamad Alsharbaji",
  },
  description:
    "Platform Engineer with 10+ years of experience in cloud platforms, Kubernetes, and building reliable distributed systems.",
  openGraph: {
    title: "Mohamad Alsharbaji | Platform Engineer",
    description:
      "Platform Engineer with 10+ years of experience in cloud platforms, Kubernetes, and building reliable distributed systems.",
    url: SITE_URL,
    siteName: "Mohamad Alsharbaji",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mohamad Alsharbaji | Platform Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamad Alsharbaji | Platform Engineer",
    description:
      "Platform Engineer with 10+ years of experience in cloud platforms, Kubernetes, and building reliable distributed systems.",
    images: [`${SITE_URL}/images/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohamad Alsharbaji",
  jobTitle: "Platform Engineer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/msharbaji",
    "https://linkedin.com/in/msharbaji93",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f8f9fa" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f1117" media="(prefers-color-scheme: dark)" />
        {/* Inline theme + locale detection — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=document.documentElement;if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches)){d.classList.add("dark")}var l=localStorage.getItem("locale");if(!l){var n=navigator.language||"";l=n.startsWith("ar")?"ar":"en"}if(l==="ar"){d.lang="ar";d.dir="rtl";d.classList.add("font-arabic")}}catch(e){}})()`,
          }}
        />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Mohamad Alsharbaji Blog" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${geistMono.variable} ${notoKufiArabic.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <a
              href="#main-content"
              className="absolute left-4 top-4 z-[100] -translate-y-24 rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-background transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              Skip to main content
            </a>
            <Header />
            <main
              id="main-content"
              className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
              tabIndex={-1}
            >
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </body>
    </html>
  );
}
