import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://afia-app.vercel.app"
  ),
  title: { default: "Afia", template: "%s | Afia" },
  description:
    "A self-help tool for health anxiety, grounded in CBT and ERP.",
  openGraph: {
    siteName: "Afia",
    type: "website",
    images: [{ url: "/Images/icon-512.png", width: 512, height: 512, alt: "Afia" }],
  },
  icons: {
    icon: [
      { url: "/Images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/Images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/Images/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Afia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        figtree.variable,
        bricolageGrotesque.variable
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking script: apply dark class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
