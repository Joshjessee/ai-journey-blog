/*
  Root Layout - This wraps ALL pages in your app

  In Next.js 14, the layout.tsx file defines the shared structure
  for your pages. This includes things like:
  - HTML and body tags
  - Navigation that appears on every page
  - Footer
  - Theme providers
  - Global state providers
*/

import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

// Metadata for SEO - this appears in browser tabs and search results
export const metadata: Metadata = {
  title: {
    default: "AI Journey | From Restaurant to AI",
    template: "%s | AI Journey",
  },
  description:
    "Follow my journey transitioning from the restaurant industry into AI. Learning notes, projects, and insights.",
  keywords: ["AI", "machine learning", "career change", "learning journey", "NLP", "prompt engineering"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Journey Blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning is needed because we're adding a class
        to <html> for dark mode, and it might differ between server and client
      */}
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/*
          ThemeProvider wraps the app to manage dark/light mode
          We'll create this component next
        */}
        <ThemeProvider>
          {/* Main app structure */}
          <div className="flex flex-col min-h-screen">
            {/* Navigation bar - appears on all pages */}
            <Navigation />

            {/* Main content area - grows to fill available space */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Footer - appears on all pages */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
