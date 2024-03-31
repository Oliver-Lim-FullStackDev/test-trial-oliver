import "./globals.css";
import { NextAuthProvider } from "./providers";

export const metadata = {
  title: "Dex Screener",
  description: "Shows the dexs from Uniswap & Pancakeswap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
