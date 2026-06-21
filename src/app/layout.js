import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import NextThemeProvider from "@/providers/NextThemeProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "RecipeHub — Recipe Sharing Platform",
  description: "RecipeHub is a platform where food enthusiasts can create, share, discover, and manage recipes. Users can publish their own recipes, browse recipes shared by others, save favorite recipes, and interact with the community. The platform creates a centralized space for recipe sharing and culinary inspiration.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased bg-background text-foreground`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextThemeProvider>
          <nav><Navbar /></nav>
          <main>{children}<ToastContainer /></main>
          <footer><Footer /></footer>
        </NextThemeProvider>
      </body>
    </html>
  );
}
