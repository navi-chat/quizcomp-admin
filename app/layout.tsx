import type { Metadata } from "next";
import { Balsamiq_Sans } from "next/font/google";
import "./globals.css";

const balsamiq = Balsamiq_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "QuizComp",
  description: "QuizComp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${balsamiq.className} antialiased dark h-full w-full`}
      >
        {children}
      </body>
    </html>
  );
}
