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

// FAQ data
const faq = [
	{
	  question: "What is Dione?",
	  answer:
		"Dione is a platform designed to help you easily discover, install, and manage open-source AI apps. It offers a clean interface, streamlined workflows, and a growing library of tools to make running local AI apps simple and accessible.",
	},
	{
	  question: "Is Dione free to use?",
	  answer:
		"Yes, Dione is completely free and open-source. Everyone is welcome to use it, contribute to it, and build on top of it.",
	},
	{
	  question: "Will Dione remain free?",
	  answer:
		"We have no plans to charge for core features or introduce invasive monetization. That goes against our values. Since Dione is open-source and self-hostable, it simply wouldn't make sense.",
	},
	{
	  question: "Do I need to log in to use Dione?",
	  answer:
		"No login is required. Your experience won't be limited if you choose not to log in. Logging in provides optional benefits like device sync, but even self-hosting requires no keys or complex setup, we've worked hard to keep it truly open and hassle-free.",
	},
	{
	  question: "What is the current state of Dione?",
	  answer:
		"Dione is in early public beta. While many features are already working, you may encounter bugs or rough edges. We're actively improving the platform based on user feedback.",
	},
	{
	  question: "Which platforms are supported?",
	  answer:
		"Dione currently supports Windows. macOS and Linux versions are in active development, and full cross-platform support is a top priority.",
	},
	{
	  question: "Where can I get help or report bugs?",
	  answer:
		"You can join our Discord community to ask questions, report bugs, or share feedback. We're active and always listening.",
	},
	{
	  question: "Can I contribute to Dione?",
	  answer:
		"Absolutely! Whether you want to improve the core app or create installation scripts, contributions are welcome. Help with macOS and Linux support is especially appreciated.",
	},
	{
	  question: "What makes Dione different from other platforms?",
	  answer:
		"Dione stands out with its clean UI, ease of use, lightweight install system, frequent updates, and a beginner-friendly scripting language for adding apps. It's built with a community-first approach that prioritizes simplicity, transparency, and extensibility.",
	},
  ];
  
