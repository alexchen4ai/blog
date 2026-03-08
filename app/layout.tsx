import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LayoutHeader from "./(component)/layoutHeader";
import LayoutFooter from "./(component)/layoutFooter";
import { ConfigProvider } from "antd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH
  ? `https://hahahaooovvv.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Alex Chen - Researcher. Founder. Builder.",
  description: "Alex Chen - Researcher. Founder. Builder.",
  openGraph: {
    title: "Alex Chen - Researcher. Founder. Builder.",
    description: "Alex Chen - Researcher. Founder. Builder.",
    images: "/home/icon.svg",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider theme={{
            components: {
              Tabs: {
                colorPrimaryHover: "#282828",
                colorPrimary: "#282828",
                colorBorderSecondary: "transparent"
              },
              Timeline: {
                colorSplit: "#E7E7E7",
                colorPrimary: "#DB805F"
              }
            }
          }}>
            <LayoutHeader />
            <div className="mt-[60px] md:mt-[80px] min-h-[calc(100vh-422px)]">
              {children}
            </div>
            <LayoutFooter />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
