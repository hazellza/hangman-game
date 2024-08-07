import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hangman Game",
  description: "this is hangman game test for free",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="cupcake" lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
