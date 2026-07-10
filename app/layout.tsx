import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Libre+Baskerville:wght@400;700&family=Cinzel:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Tangerine:wght@400;700&family=Niconne&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}


