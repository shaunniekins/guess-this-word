import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Guess This Word",
  description: "Created by Shaun Niel Ochavo",
  icons: [{ rel: "icon", href: "/public/guess-this-word-logo.png" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
