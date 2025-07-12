"use client";

import {
	Download,
	GitBranch,
	Monitor,
	RefreshCw,
	Search,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import FAQ from "../components/home/FAQ";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";

export default function Home() {
	const [openItems, setOpenItems] = useState<number[]>([]);

	useEffect(() => {
		// randomly select 2 items to be open initially
		const shuffled = [...Array(faq.length).keys()].sort(
			() => Math.random() - 0.5,
		);
		setOpenItems(shuffled.slice(0, 2));
	}, []);

	const toggleItem = (index: number) => {
		setOpenItems((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
		);
	};

	return (
		<main>
			<div className="relative flex flex-col items-center min-h-screen px-4 sm:px-8 pt-24 sm:pt-28 pb-10 gap-2">
				<div
					className="absolute inset-0 pointer-events-none"
					aria-hidden="true"
				></div>
				<Hero />
				<Features features={features} />
				<p className="text-white/80 text-sm mt-4 text-center">
					Want to know more? Try it now, free!
				</p>
				<FAQ faq={faq} openItems={openItems} toggleItem={toggleItem} />
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
		answer:
			"Dione is a platform to easily discover, install, and manage open-source AI apps. It offers a simple interface, streamlined workflows, and a growing library of tools designed to make running local AI apps effortless.",
	},
	{
		question: "Is Dione free to use?",
		answer:
			"Yes! Dione is completely free and open-source. Everyone is welcome to use it, contribute to it, and build with it.",
	},
	{
		question: "What is the current state of Dione?",
		answer:
			"Dione is currently in early public beta. Many features are functional, but bugs and rough edges are to be expected. We're rapidly iterating based on user feedback to improve stability and add new features.",
	},
	{
		question: "Which platforms are supported?",
		answer:
			"Dione supports Windows, with macOS and Linux currently under active development. Full support for all major platforms is a top priority.",
	},
	{
		question: "Where can I get help or report bugs?",
		answer:
			"Join our Discord community to ask questions, share feedback, or report issues. We're active and always listening.",
	},
	{
		question: "Can I contribute to Dione?",
		answer:
			"Absolutely! You can contribute by improving the app itself, or by creating installation scripts for apps. Contributions for macOS and Linux support are especially welcome!",
	},
	{
		question: "What makes Dione different from other platforms?",
		answer:
			"Dione stands out thanks to its clean user interface, ease of use, lightweight installation system, frequent updates, and a beginner-friendly scripting language for adding new apps. We're building a community-first platform focused on simplicity, transparency, and extensibility.",
	},
];
