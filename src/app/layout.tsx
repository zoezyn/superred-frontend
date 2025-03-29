import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { AuthProvider } from '@/context/AuthContext'

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
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* <main className="flex-1 overflow-auto">{children}</main> */}
            <div className="w-full flex flex-1 flex-col">
              <img
                // src="/background.jpg"
                src="/bg.svg"
                alt="City panorama"
                className="fixed h-full w-full opacity-30 object-cover"
                // className="fixed inset-0 h-full w-full object-cover opacity-40 grayscale"
              />
              {/* <div className="fixed inset-0 bg-black/50 z-0"></div> */}
              {/* <div className="fixed inset-0 bg-grid-pattern opacity-20 z-0"></div> */}
              <main className="flex-1 overflow-auto z-10">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
