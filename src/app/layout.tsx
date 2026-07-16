import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Jaya Mahal Palace · Heritage Hotel, Bengaluru",
  description:
    "A colonial-era palace on 19 acres of heritage gardens in the heart of Bengaluru. Rooms, suites, royal venues and Gallops Restaurant. Book your stay directly.",
  openGraph: {
    title: "Jaya Mahal Palace · Heritage Hotel, Bengaluru",
    description: "19 acres of royal heritage in the heart of Bengaluru. Book direct.",
    images: ["/media/palace-poster.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
