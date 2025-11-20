import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Timeline AI",
  description: "Upload your architectural drawings and generate professional project timelines with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
