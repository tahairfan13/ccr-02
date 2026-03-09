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
  display: "swap",
});

export const metadata: Metadata = {
  title: "App Development Cost Calculator | How Much Does an App Cost? | Tecaudex",
  description: "Use our free app development cost calculator to instantly estimate how much it costs to build a mobile or web app in the UK. Get a real cost breakdown in under 2 minutes.",
  icons: {
    icon: "/tecaudex.svg",
  },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "App Development Cost Calculator",
              description: "Free calculator to estimate how much it costs to build a mobile app or web app in the UK.",
              url: "https://calculator.tecaudex.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "GBP",
              },
              provider: {
                "@type": "Organization",
                name: "Tecaudex",
                url: "https://www.tecaudex.com",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How much does it cost to make an app in the UK?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most custom app projects in the UK range from £10,000 for a simple MVP to £100,000+ for complex platforms. The exact cost depends on features, platform, and team.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How accurate is this cost calculator?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The calculator gives a directional estimate based on typical project parameters. For a precise quote tailored to your requirements, book a free discovery call with our team.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does it take to build an app?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Simple apps take 8–12 weeks. More complex products typically take 4–9 months from scoping to launch.",
                  },
                },
              ],
            }),
          }}
        />
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
