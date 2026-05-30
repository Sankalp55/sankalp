import type { Metadata } from "next";
import "./globals.css";
import Chrome from "@/components/Chrome";

export const metadata: Metadata = {
  title: "Sankalp Tyagi — Frontend Focused Full Stack Developer",
  description:
    "Sankalp Tyagi builds expressive interfaces with React, Next.js and Framer Motion. UI engineering and interaction quality, obsessed over.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
