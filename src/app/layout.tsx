import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/Provider";

export const metadata: Metadata = {
  title: "Init Next App",
  description: "Init Next App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
