import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import Script from "next/script";
import Background from "@/components/layout/Background";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

// initialize poppins font
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
		<html lang="en" className="dark">
			<body className={`${poppins.className} font-sans bg-[#080808]`}>
				<Background />
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

				{/* google tag manager noscript fallback */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-NP7VRXHK"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					/>
				</noscript>

				{/* main layout components */}
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
