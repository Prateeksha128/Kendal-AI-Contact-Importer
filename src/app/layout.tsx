import type { Metadata } from "next";
import "./globals.css";
import { FileProvider } from "@/contexts/FileContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Kendal AI | Your AI Workforce for Real Estate",
  description:
    "Your Real Estate Workforce. Powered by AI. Used By Agents From Betterhomes, Prime Capital, Chestertons & More.",
  icons: {
    icon: "https://framerusercontent.com/images/scryoJwCc5uJhWYQmisrZ83M0.png",
  },
  openGraph: {
    type: "website",
    title: "Kendal AI | Your AI Workforce for Real Estate",
    description:
      "Your Real Estate Workforce. Powered by AI. Used By Agents From Betterhomes, Prime Capital, Chestertons & More.",
    images: [
      {
        url: "https://framerusercontent.com/images/sDIPiQaawjbuRHjYeRaLIPvbWY.png",
        width: 1200,
        height: 630,
        alt: "Kendal AI Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kendal AI | Your AI Workforce for Real Estate",
    description:
      "Your Real Estate Workforce. Powered by AI. Used By Agents From Betterhomes, Prime Capital, Chestertons & More.",
    images: [
      "https://framerusercontent.com/images/sDIPiQaawjbuRHjYeRaLIPvbWY.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <FileProvider>{children}</FileProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10b981",
                color: "#fff",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#ef4444",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
