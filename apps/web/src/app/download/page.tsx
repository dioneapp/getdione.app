"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DownloadPage() {
	const [detectedOS, setDetectedOS] = useState<string | null>(null);
	const [linuxOpen, setLinuxOpen] = useState(false);

	useEffect(() => {
		const ua = window.navigator.userAgent;
		if (ua.indexOf("Win") !== -1) setDetectedOS("Windows");
		else if (ua.indexOf("Mac") !== -1) setDetectedOS("macOS");
		else if (ua.indexOf("Linux") !== -1) setDetectedOS("Linux");
	}, []);

	const platforms = [
		{
			name: "Windows",
			icon: "/Windows.svg",
			href: "https://api.getdione.app/v1/download?os=windows",
			description: "Windows 10/11 (64-bit)",
			id: "windows",
		},
		{
			name: "macOS",
			icon: "/Apple.svg",
			href: "https://api.getdione.app/v1/download?os=mac",
			description: "Apple Silicon",
			id: "mac",
		},
		{
			name: "Linux",
			icon: "/Linux.svg",
			description: "Select your distribution",
			id: "linux",
			options: [
				{
					label: "AppImage",
					href: "https://api.getdione.app/v1/download?os=linux",
				},
				{
					label: ".deb",
					href: "https://api.getdione.app/v1/download?os=linuxdeb",
				},
				{
					label: ".rpm",
					href: "https://api.getdione.app/v1/download?os=linuxrpm",
				},
			],
		},
	];

	const orderedPlatforms = useMemo(() => {
		if (!detectedOS) return platforms;
		const target = platforms.find((p) => p.name === detectedOS);
		const others = platforms.filter((p) => p.name !== detectedOS);
		if (!target) return platforms;

		return [others[0], target, others[1]];
	}, [detectedOS]);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-20 -mt-16 sm:-mt-22">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
			>
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tighter mb-4 sm:mb-6 text-balance">
					Download Dione
				</h1>
				<p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto px-4">
					Select your operating system to start the download.
				</p>
			</motion.div>

			<div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-6xl w-full">
				{orderedPlatforms.map((platform, index) => {
					const isDetected = platform.name === detectedOS;
					const isLinux = platform.id === "linux";

					return (
						<motion.div
							key={platform.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{
								opacity: 1,
								y: 0,
							}}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className={`group relative flex flex-col items-center p-8 rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 w-full md:w-1/3 ${
								isDetected
									? "bg-white/10 border border-white/20 shadow-white/5"
									: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
							}`}
						>
							{isDetected && (
								<div className="absolute -top-3 px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider">
									Recommended
								</div>
							)}

							<div className="p-4 rounded-full bg-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
								<Image
									src={platform.icon}
									alt={platform.name}
									width={32}
									height={32}
									className={`w-8 h-8 ${
										platform.id === "linux" ? "" : "brightness-0 invert"
									}`}
								/>
							</div>
							<h2 className="text-xl font-medium text-white mb-2">
								{platform.name}
							</h2>
							<p className="text-white/70 text-sm mb-6">
								{platform.description}
							</p>

							{isLinux ? (
								<div className="w-full mt-auto relative">
									<button
										onClick={() => setLinuxOpen(!linuxOpen)}
										className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full w-full font-semibold text-sm transition-colors ${
											linuxOpen
												? "bg-white text-black"
												: "bg-white/10 text-white hover:bg-white hover:text-black"
										}`}
									>
										<Download className="w-4 h-4" />
										<span>Download</span>
										<ChevronDown
											className={`w-4 h-4 transition-transform duration-200 ${
												linuxOpen ? "rotate-180" : ""
											}`}
										/>
									</button>

									<AnimatePresence>
										{linuxOpen && (
											<motion.div
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												className="absolute left-0 right-0 top-full mt-2 p-2 rounded-xl bg-[#1A1A1A] border border-white/10 shadow-xl z-20 flex flex-col gap-1"
											>
												{platform.options?.map((opt) => (
													<a
														key={opt.label}
														href={opt.href}
														className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white text-sm transition-colors"
													>
														<span>{opt.label}</span>
														<Download className="w-3 h-3" />
													</a>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							) : (
								<a
									href={platform.href}
									className={`mt-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-colors w-full ${
										isDetected
											? "bg-white text-black hover:bg-white/90"
											: "bg-white/10 text-white hover:bg-white hover:text-black"
									}`}
								>
									<Download className="w-4 h-4" />
									<span>Download</span>
								</a>
							)}
						</motion.div>
					);
				})}
			</div>

			<a className="mt-6" href="https://apps.microsoft.com/detail/9N59N7SJRPRK?referrer=appbadge&amp;mode=direct&cid=badge_website">
				<img src="https://get.microsoft.com/images/en-us%20dark.svg" width="200">
			</a>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="text-white/60 text-sm mt-12 text-center"
			>
				By downloading, you agree to our{" "}
				<Link
					href="/legal/terms-use"
					className="text-white/80 hover:text-white underline"
				>
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link
					href="/legal/privacy-policy"
					className="text-white/80 hover:text-white underline"
				>
					Privacy Policy
				</Link>
				.
			</motion.p>
		</main>
	);
}
