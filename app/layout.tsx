import type { Metadata } from "next";
import { Outfit, Libre_Baskerville, Cinzel, Great_Vibes } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"]
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"]
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "900"]
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Brand Monk Academy - Webinar Certificates",
  description: "Register for webinars and download your certificates from Brand Monk Academy",
  keywords: "webinar, certificate, brand monk, academy, training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${libreBaskerville.variable} ${cinzel.variable} ${greatVibes.variable} ${outfit.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}


