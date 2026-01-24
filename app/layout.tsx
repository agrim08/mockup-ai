import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UIUX Mockup AI",
  description: "Generated quality mockups for your UIUX projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Provider>
            {children}
        </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}
