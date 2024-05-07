import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";

import { Toaster } from "@/components/ui/toaster"
import { ModalProvider } from "@/provider/modal-provider";

import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin DashBoard",
  description: "Admin DashBoard for Ecommerce App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
