import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteConfig } from "@/lib/siteConfig";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [title, description, keywords, siteIcon] = await Promise.all([
    getSiteConfig("site_title"),
    getSiteConfig("site_description"),
    getSiteConfig("site_keywords"),
    getSiteConfig("site_icon"),
  ]);

  return {
    title: title || "Blog with LaTeX",
    description:
      description ||
      "A blog built with Next.js, supporting LaTeX math formulas.",
    keywords: keywords || undefined,
    icons: siteIcon ? { icon: siteIcon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
