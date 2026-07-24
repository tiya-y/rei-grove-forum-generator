import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "REI Grove Forum Post Generator",
  description: "Generate discussion-starter posts for the REI Grove community forums",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} style={{ colorScheme: "light" }}>
      <body className="h-full min-h-screen bg-[#F8F9FB] flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
