import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"], // Important for Vietnamese content
  weight: ["300", "400", "700", "900"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "vhistory - Vietnamese Dialect Dictionary",
  description: "Preserving the heritage of Vietnamese language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={cn(
          merriweather.variable,
          inter.variable,
          "antialiased min-h-screen flex flex-col"
        )}
      >
        <header className="p-6 border-b border-sand-200 bg-sand-50 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="font-serif text-2xl font-bold text-terracotta-700">vhistory</div>
                <div className="flex gap-4 text-sm font-medium text-sand-500">
                    <a href="#" className="hover:text-terracotta-600 transition-colors">Dictionary</a>
                    <a href="#" className="hover:text-terracotta-600 transition-colors">Map</a>
                    <a href="#" className="hover:text-terracotta-600 transition-colors">About</a>
                </div>
            </nav>
        </header>
        <main className="flex-1">
            {children}
        </main>
        <footer className="py-8 bg-sand-100 text-center text-sand-400 text-sm">
            &copy; {new Date().getFullYear()} vhistory. Preserving Heritage.
        </footer>
      </body>
    </html>
  );
}
