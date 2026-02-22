import type { Metadata } from "next";
import { Syne, DM_Sans, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://malsharbaji.com";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mohamad Alsharbaji — Platform Engineer",
    template: "%s | Mohamad Alsharbaji",
  },
  description:
    "Platform Engineer with 10+ years of experience in cloud platforms, Kubernetes, and building reliable distributed systems.",
  openGraph: {
    title: "Mohamad Alsharbaji — Platform Engineer",
    description:
      "Platform Engineer with 10+ years of experience in cloud platforms, Kubernetes, and building reliable distributed systems.",
    url: siteUrl,
    siteName: "Mohamad Alsharbaji",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mohamad Alsharbaji — Platform Engineer",
    description:
      "Platform Engineer with 10+ years of experience in cloud platforms, Kubernetes, and building reliable distributed systems.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohamad Alsharbaji",
  jobTitle: "Platform Engineer",
  url: siteUrl,
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
        {/* Inline locale detection — runs before paint to prevent LTR→RTL layout shift */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("locale");if(!l){var n=navigator.language||"";l=n.startsWith("ar")?"ar":"en"}if(l==="ar"){var d=document.documentElement;d.lang="ar";d.dir="rtl";d.classList.add("font-arabic")}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${geistMono.variable} ${notoKufiArabic.variable} min-h-screen antialiased`}
      >
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
