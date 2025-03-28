import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Super Red",
  description: "A discussion platform for various topics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="relative flex-1 ">
            <img
              // src="/background.jpg"
              src="/bg.svg"
              alt="City panorama"
              className="fixed h-full w-full opacity-30 object-cover"
              // className="fixed inset-0 h-full w-full object-cover opacity-40 grayscale"
            />
            {/* <div className="fixed inset-0 bg-black/50 z-0"></div> */}
            {/* <div className="fixed inset-0 bg-grid-pattern opacity-20 z-0"></div> */}
            <main className="relative z-10 w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
