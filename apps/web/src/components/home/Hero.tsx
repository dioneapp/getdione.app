"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CirclePlay, Play } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Hero() {
	const [showVideo, setShowVideo] = useState(false);
	const videoRef = useRef<HTMLIFrameElement>(null);
	return (
		<section className="relative flex flex-col items-center justify-center px-4">
			<div
				className="absolute inset-0 pointer-events-none"
				aria-hidden="true"
			></div>
			<AnimatePresence initial={false} mode="wait">
				{showVideo && (
					<motion.div key="video-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowVideo(false)}>
						<motion.div key="video-dialog" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.2 }} className="flex justify-center items-center w-full h-full max-w-4xl max-h-[60vh] m-auto">
							<iframe
								ref={videoRef}
								width="100%"
								height="800px"
								src="https://www.youtube.com/embed/5cWy7-LaUTk?autoplay=1&cc_load_policy=1&mute=1&rel=0&vq=hd1080&controls=0&loop=1"
								title="YouTube video player"
								frameBorder="0"
								allow="autoplay; encrypted-media;"
								allowFullScreen
								className="w-full h-full aspect-video rounded-xl shadow-2xl shadow-white/5 border border-white/5 bg-black"
							></iframe>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<h1
				className="text-center font-medium tracking-tighter text-5xl max-w-4xl text-balance whitespace-pre-line"
				style={{
					backgroundImage: "linear-gradient(180deg, #FFFFFF, #BBBBBB)",
					WebkitBackgroundClip: "text",
					backgroundClip: "text",
					color: "transparent",
				}}
			>
				It has never been easier to install AI on your computer
			</h1>
			<p
				className="mt-4 max-md:mb-5 max-w-2xl text-center text-base sm:text-sm text-neutral-300 leading-relaxed text-balance px-4"
				style={{ textRendering: "optimizeLegibility" }}
			>
				Explore powerful tools, seamless downloads, 1-click installs.
			</p>
			{/* App screenshot (hidden on mobile) */}
			<motion.section
				className="hidden sm:block w-full max-w-5xl my-5 mt-10 transition-all duration-300"
			>
				<div className="relative flex justify-center">
					<div className="relative group">
						<button type="button" className="relative block" onClick={() => setShowVideo(true)}>
							<span className={`absolute inset-0 hidden cursor-pointer items-center justify-center z-10 rounded-lg ${showVideo ? "hidden" : " group-hover:flex"}`}>
								<Play className="w-20 h-20 text-neutral-300/80" />
							</span>
							<Image
								src="https://pbs.twimg.com/media/G1S8Y01WIAAfcrl?format=jpg&name=large"
								alt="Dione app screenshot"
								width={750}
								height={500}
								quality={100}
								unoptimized
								priority
								className="object-cover rounded-lg opacity-85 brightness-110 group-hover:brightness-80 group-hover:shadow-xl border border-transparent group-hover:border-neutral-400/60 transition-all duration-300"
							/>
						</button>
					</div>
				</div>
			</motion.section>
			<div
				className="flex flex-col items-center w-full max-w-xl gap-3 sm:gap-4"
				aria-label="Primary"
			>
				<a
					href="https://github.com/dioneapp/dioneapp/releases/latest"
					target="_blank"
					rel="noopener noreferrer"
					className="shrink-0 h-10 sm:h-11 px-6 sm:px-7 flex items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-lg"
					aria-label="Download Dione"
				>
					Download Dione
				</a>

				<div className="flex items-center gap-4 text-sm text-white/70">
					<a
						href="https://github.com/dioneapp"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 hover:text-white transition-colors"
						aria-label="Visit our GitHub repository"
					>
						<svg
							className="w-4 h-4"
							viewBox="0 0 256 250"
							width="256"
							height="250"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid"
							aria-hidden="true"
							role="img"
						>
							<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
						</svg>
						<span>GitHub</span>
					</a>
					<span className="text-white/20">•</span>
					<a
						href="https://discord.gg/JSAszyCEW5"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 hover:text-white transition-colors"
						aria-label="Join our Discord community"
					>
						<svg
							className="w-4 h-4"
							viewBox="0 0 256 199"
							width="256"
							height="199"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid"
							aria-hidden="true"
							role="img"
						>
							<path
								d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
								fill="currentColor"
							/>
						</svg>
						<span>Discord</span>
					</a>
				</div>
			</div>
		</section>
	);
}
