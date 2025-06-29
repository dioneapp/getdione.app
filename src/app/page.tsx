"use client";

import {
	Download,
	GitBranch,
	Monitor,
	RefreshCw,
	Search,
	Zap,
	ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
	const [openItems, setOpenItems] = useState<number[]>([]);
	const toggleItem = (index: number) => {
		setOpenItems((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index]
		);
	};

	return (
		<main>
			{/* main content */}
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				></div>

				<svg
					className="animate-float w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mt-8 sm:mt-0"
					width="525"
					height="555"
					viewBox="0 0 525 555"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Dione mascot logo"
					role="img"
				>
					<circle cx="262.5" cy="262.5" r="262.5" fill="white"></circle>
					<circle cx="164" cy="506" r="49" fill="white"></circle>
					<circle cx="359" cy="506" r="49" fill="white"></circle>
					<circle cx="105.483" cy="202.109" r="23.3512" fill="#080808"></circle>
					<circle cx="294.161" cy="202.109" r="23.3512" fill="#080808"></circle>
					<rect
						x="148"
						y="179"
						width="104.613"
						height="46.7025"
						rx="23.3512"
						fill="#080808"
					></rect>
				</svg>

				<h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					Dione
				</h1>

				<p
					className="mt-4 mb-8 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4"
					style={{ textRendering: "optimizeLegibility" }}
				>
					<span className="inline-block">
						Discover & install open-source AI apps with Dione. Explore powerful
						tools, seamless downloads, 1-click installs.
					</span>
				</p>

				<nav
					className="flex flex-col sm:flex-row flex-wrap justify-center items-center w-full max-w-xl gap-3 sm:gap-4"
					aria-label="Primary"
				>
					<a
						href="https://github.com/dioneapp"
						target="_blank"
						rel="noopener noreferrer"
						className="shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
						aria-label="Visit our GitHub repository"
					>
						<svg
							className="w-5 h-5"
							viewBox="0 0 256 250"
							width="256"
							height="250"
							fill="#080808"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid"
							aria-hidden="true"
							role="img"
						>
							<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
						</svg>
						<span className="font-semibold">GitHub</span>
					</a>

					<a
						href="https://github.com/dioneapp/dioneapp/releases"
						target="_blank"
						rel="noopener noreferrer"
						className="shrink-0 h-11 sm:h-12 px-8 sm:px-10 flex items-center justify-center bg-white/10 backdrop-blur border border-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
						aria-label="Download Dione"
					>
						Download
					</a>

					<a
						href="https://discord.gg/JSAszyCEW5"
						target="_blank"
						rel="noopener noreferrer"
						className="shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
						aria-label="Join our Discord community"
					>
						<svg
							className="w-5 h-5"
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
								fill="#080808"
							></path>
						</svg>
						<span className="font-semibold">Discord</span>
					</a>
				</nav>

				<p className="text-white/60 text-sm mt-4 text-center">
					Dione is still in beta. Join Discord for updates.
				</p>

				{/* feature cards */}
				<section
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-18 px-4 max-w-5xl w-full"
					aria-labelledby="features-heading"
				>
					<h2 id="features-heading" className="sr-only">
						Features
					</h2>
					{features.map((feature) => (
						<article
							key={feature.title}
							className="group p-5 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
						>
							<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 mb-4">
								{feature.icon}
							</div>
							<h3 className="text-lg sm:text-xl font-medium text-white mb-2">
								{feature.title}
							</h3>
							<p className="text-sm sm:text-base text-white/70">
								{feature.description}
							</p>
						</article>
					))}
				</section>

				<p className="text-white/80 text-sm mt-6 text-center">
					Want to know more? Try it now, free!
				</p>

				{/* faq section */}
				<section className="w-full max-w-3xl mx-auto mt-16" aria-labelledby="faq-heading">
					<h2 id="faq-heading" className="text-3xl sm:text-4xl font-semibold text-white text-center mb-12">
						Frequently Asked Questions
					</h2>
					<div className="space-y-0">
						{faq.map((item, index) => (
							<article key={index} className="border-b border-white/10 last:border-b-0">
								<button
									onClick={() => toggleItem(index)}
									className="w-full py-6 text-left flex items-center justify-between text-white hover:text-white/80 transition-colors duration-200 cursor-pointer"
									aria-expanded={openItems.includes(index)}
									aria-controls={`faq-answer-${index}`}
								>
									<span className="font-medium text-lg pr-4">{item.question}</span>
									<ChevronDown
										className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openItems.includes(index) ? "rotate-180" : ""}`}
									/>
								</button>
								<div
									id={`faq-answer-${index}`}
									className={`transition-all duration-300 overflow-hidden ${openItems.includes(index) ? "max-h-32 pb-6" : "max-h-0"}`}
								>
									<p className="text-white/70 leading-relaxed">{item.answer}</p>
								</div>
							</article>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}

// feature data
const features = [
	{
		title: "Easy Installation",
		description: "One-click install for all your favorite AI tools",
		icon: <Download className="w-6 h-6 text-white" />,
	},
	{
		title: "Open Source",
		description: "Community-driven development and transparency",
		icon: <GitBranch className="w-6 h-6 text-white" />,
	},
	{
		title: "Cross Platform",
		description: "Available on Windows, Mac and Linux (coming soon)",
		icon: <Monitor className="w-6 h-6 text-white" />,
	},
	{
		title: "Auto Updates",
		description: "Stay current with automatic app updates and notifications",
		icon: <RefreshCw className="w-6 h-6 text-white" />,
	},
	{
		title: "App Discovery",
		description: "Find and explore new AI tools curated by the community",
		icon: <Search className="w-6 h-6 text-white" />,
	},
	{
		title: "Resource Efficient",
		description: "Optimized performance with minimal system impact",
		icon: <Zap className="w-6 h-6 text-white" />,
	},
];

// faq data
const faq = [
  {
    question: "What is Dione?",
    answer: "Dione is a platform to easily discover, install, and manage open-source AI apps. It offers a simple interface, streamlined workflows, and a growing library of tools designed to make running local AI apps effortless.",
  },
  {
    question: "Is Dione free to use?",
    answer: "Yes! Dione is completely free and open-source. Everyone is welcome to use it, contribute to it, and build with it.",
  },
  {
    question: "What is the current state of Dione?",
    answer: "Dione is currently in early public beta. Many features are functional, but bugs and rough edges are to be expected. We're rapidly iterating based on user feedback to improve stability and add new features.",
  },
  {
    question: "Which platforms are supported?",
    answer: "Dione supports Windows, with macOS and Linux currently under active development. Full support for all major platforms is a top priority.",
  },
  {
    question: "Where can I get help or report bugs?",
    answer: "Join our Discord community to ask questions, share feedback, or report issues. We're active and always listening.",
  },
  {
    question: "Can I contribute to Dione?",
    answer: "Absolutely! You can contribute by improving the app itself, or by creating installation scripts for apps. Contributions for macOS and Linux support are especially welcome!",
  },
  {
    question: "What makes Dione different from other platforms?",
    answer: "Dione stands out thanks to its clean user interface, ease of use, lightweight installation system, frequent updates, and a beginner-friendly scripting language for adding new apps. We're building a community-first platform focused on simplicity, transparency, and extensibility."
  }
];

