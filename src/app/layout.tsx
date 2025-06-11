import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./assets/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dione",
  description: "Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      <meta name="generator" content="Next.js" />
      <meta name="application-name" content="Dione" />
      <meta
          name="description"
          content="Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform."
      />
      <meta name="theme-color" content="#110F0F" />
      <meta name="color-scheme" content="dark" />
      <meta name="msapplication-TileColor" content="#110F0F" />
      <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="https://getdione.app" />
      <meta name="twitter:creator" content="@dioneapp" />
      <meta name="twitter:title" content="Dione" />
      <meta
          name="twitter:description"
          content="Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform."
      />
      <meta
          name="twitter:image"
          content="https://getdione.app/opengraph-image.png"
      />
      <meta property="og:image:width" content="3000" />
      <meta property="og:image:height" content="1000" />
      <meta property="og:site_name" content="Dione" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://getdione.app" />
      <meta property="og:title" content="Dione" />
      <meta
          property="og:description"
          content="Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform."
      />
      <meta
      httpEquiv="Content-Security-Policy"
      content="style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;"
      />
      <meta
          property="og:image"
          content="https://getdione.app/opengraph-image.png"
      />
      <title>Dione</title>
      </head>
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
