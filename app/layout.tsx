import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dentaldesk.ai"),
  title: "DentalDesk | 24/7 AI Receptionist for Modern Dental Practices",
  description:
    "Never miss a patient call again. DentalDesk is the intelligent 24/7 AI receptionist that answers phones, schedules appointments in your PMS (Dentrix, Eaglesoft, Open Dental), and handles emergency dental triage.",
  keywords: [
    "dental AI receptionist",
    "dental practice software",
    "Dentrix AI integration",
    "Eaglesoft appointment booking",
    "Open Dental AI receptionist",
    "dental after-hours call answering",
    "dental clinic scheduling bot",
    "Dentina alternative",
  ],
  authors: [{ name: "DentalDesk Technologies" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "48x48" },
      { url: "/media/dentaldesk-icon.png", type: "image/png", sizes: "206x206" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "DentalDesk - 24/7 AI Dental Receptionist Software",
    description:
      "Eliminate missed calls, automate patient appointment scheduling, and answer FAQs around the clock with human-like conversational AI built specifically for dental practices.",
    images: ["/media/dentaldesk-full-logo.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-cyan-100 selection:text-sky-900 font-sans">
        {children}
      </body>
    </html>
  );
}
