import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import FacebookPixel from "@/components/FacebookPixel";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tecaudex Cost Calculator - AI-Powered Project Estimates",
  description: "Get accurate development cost estimates for your tech project. AI-powered analysis for web, mobile, blockchain, and AI applications.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11413456672"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11413456672');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <FacebookPixel />
        <MicrosoftClarity />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
