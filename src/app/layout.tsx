import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import Background from "@/components/layout/Background";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const poppins = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
	width: "device-width",
	themeColor: "#110F0F",
	colorScheme: "dark",
};

export const metadata: Metadata = {
	title: "Dione - Discover & Install Open-Source AI Apps",
	description:
		"Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform.",
	applicationName: "Dione",
	robots: "index, follow",
	generator: "Next.js",
	metadataBase: new URL("https://getdione.app"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://getdione.app",
		siteName: "Dione",
		title: "Dione - Discover & Install Open-Source AI Apps",
		description:
			"Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform.",
		images: [
			{
				url: "https://getdione.app/opengraph-image.png",
				width: 1280,
				height: 640,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "https://getdione.app",
		creator: "@dioneapp",
		title: "Dione - Discover & Install Open-Source AI Apps",
		description:
			"Discover and install open-source AI apps effortlessly with Dione. Explore powerful tools, manage downloads, and enjoy 1-click installations—all in one intuitive platform.",
		images: ["https://getdione.app/opengraph-image.png"],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
	},
	other: {
		"msapplication-TileColor": "#110F0F",
		"mobile-web-app-capable": "yes",
	},
};

// analytics scripts
const GTM_SCRIPT = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NP7VRXHK');
`;

const GA_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YJKEH2QD9S');
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			{/* google tag manager */}
			<Script id="gtm-script" strategy="afterInteractive">
				{GTM_SCRIPT}
			</Script>

			{/* google analytics */}
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-YJKEH2QD9S"
				strategy="afterInteractive"
			/>
			<Script id="ga-script" strategy="afterInteractive">
				{GA_SCRIPT}
			</Script>

			{/* databuddy analytics */}
			<script
			    src="https://cdn.databuddy.cc/databuddy.js"
			    data-client-id="8BfVPY6P64vdd9uSjIYWF"
			    data-track-hash-changes="true"
			    data-track-attributes="true"
			    data-track-outgoing-links="true"
			    data-track-interactions="true"
			    data-track-engagement="true"
			    data-track-scroll-depth="true"
			    data-track-exit-intent="true"
			    data-track-bounce-rate="true"
			    data-track-web-vitals="true"
			    data-track-errors="true"
			    data-enable-batching="true"
			    crossorigin="anonymous"
			    async
			  ></script>

			{/* google tag manager noscript fallback */}

			<body className={`${poppins.variable} antialiased min-h-screen`}>
				<Background />
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
