"use client";

import { motion } from "framer-motion";
import {
	Code2,
	DollarSign,
	Download,
	GitBranch,
	HelpCircle,
	Info,
	LogIn,
	Monitor,
	RefreshCw,
	Rocket,
	Search,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AppCarousel from "@/components/home/AppCarousel";
import {
	defaultTransition,
	fadeInUpVariants,
	fadeInVariants,
	scaleInVariants,
	slowTransition,
	staggerContainerVariants,
	staggerItemVariants,
	useScrollAnimation,
} from "@/utils/use-scroll-animation";
import FAQ from "../components/home/FAQ";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";

export default function Home() {
	const [openItems, setOpenItems] = useState<number[]>([]);

	// Scroll animation hooks for different sections
	const heroAnimation = useScrollAnimation(0.2);
	const screenshotAnimation = useScrollAnimation(0.15);
	const betaTextAnimation = useScrollAnimation(0.3);
	const carouselAnimation = useScrollAnimation(0.1);
	const featuresAnimation = useScrollAnimation(0.1);
	const faqAnimation = useScrollAnimation(0.1);

	useEffect(() => {
		// randomly select 4 items to be open initially
		const shuffled = [...Array(faq.length).keys()].sort(
			() => Math.random() - 0.5,
		);
		setOpenItems(shuffled.slice(0, 4));
	}, []);

	const toggleItem = (index: number) => {
		setOpenItems((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
		);
	};

		return (
			<main>
				<div className="relative flex flex-col items-center min-h-screen px-4 sm:px-8 pt-16 sm:pt-20 pb-10 gap-2">
					<div
					>
						<Hero />
					</div>

					{/* App screenshot (hidden on mobile) */}
					<motion.section
						className="hidden sm:block w-full max-w-5xl mt-10 sm:mt-12"
					>
						<div className="relative">
							<div className="h-full w-full rounded-xl overflow-hidden bg-gradient-to-b from-white/10 via-white/30 to-white/10 p-0.5 shadow-2xl shadow-black">
								<div className="overflow-hidden">
									<Image
										src="/app.png"
										alt="Dione app screenshot"
										width={1195}
										height={800}
										quality={100}
										unoptimized
										priority
										sizes="(max-width: 1024px) 100vw, 1024px"
										className="w-full h-auto rounded-xl"
									/>
								</div>
							</div>
						</div>
				</motion.section>

				<motion.p
					ref={betaTextAnimation.ref}
					initial="hidden"
					animate={betaTextAnimation.mainControls}
					variants={fadeInVariants}
					transition={defaultTransition}
					className="text-white/60 text-sm mt-4 text-center"
				>
					Dione is still in beta. Join{" "}
					<a
						href="https://getdione.app/discord"
						className="text-white/300 hover:text-white transition-opacity duration-200 hover:underline"
					>
						Discord
					</a>{" "}
					for updates.
				</motion.p>

				{/* App carousel */}
				<motion.section
					ref={carouselAnimation.ref}
					initial="hidden"
					animate={carouselAnimation.mainControls}
					variants={fadeInUpVariants}
					transition={defaultTransition}
					className="w-full max-w-7xl"
				>
					<AppCarousel />
				</motion.section>

				{/* Features */}
				<motion.section
					ref={featuresAnimation.ref}
					initial="hidden"
					animate={featuresAnimation.mainControls}
					variants={staggerContainerVariants}
					className="w-full max-w-5xl mt-14 sm:mt-20"
				>
					<motion.h2
						variants={staggerItemVariants}
						transition={defaultTransition}
						className="text-center text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 tracking-tight"
						style={{
							backgroundImage: "linear-gradient(180deg, #FFFFFF, #BBBBBB)",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
						}}
					>
						Why people like Dione
					</motion.h2>
					<motion.div
						variants={staggerItemVariants}
						transition={defaultTransition}
						className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-8"
					></motion.div>
					<motion.div
						variants={staggerItemVariants}
						transition={defaultTransition}
					>
						<Features features={features} />
					</motion.div>
				</motion.section>

				{/* FAQ */}
				<motion.section
					ref={faqAnimation.ref}
					initial="hidden"
					animate={faqAnimation.mainControls}
					variants={staggerContainerVariants}
					className="w-full max-w-4xl mt-16 sm:mt-24"
				>
					<motion.h2
						variants={staggerItemVariants}
						transition={defaultTransition}
						className="text-center text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 tracking-tight"
						style={{
							backgroundImage: "linear-gradient(180deg, #FFFFFF, #BBBBBB)",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
						}}
					>
						Questions & answers
					</motion.h2>
					<motion.div
						variants={staggerItemVariants}
						transition={defaultTransition}
						className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-8"
					></motion.div>
					<motion.div
						variants={staggerItemVariants}
						transition={defaultTransition}
					>
						<FAQ faq={faq} openItems={openItems} toggleItem={toggleItem} />
					</motion.div>
				</motion.section>
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
		icon: <Info className="w-5 h-5 text-white" />,
	},
	{
		question: "Is Dione free to use?",
		answer:
			"Yes, Dione is completely free and open-source. Everyone is welcome to use it, contribute to it, and build on top of it.",
		icon: <DollarSign className="w-5 h-5 text-white" />,
	},
	{
		question: "Will Dione remain free?",
		answer:
			"We have no plans to charge for core features or introduce invasive monetization. That goes against our values. Since Dione is open-source and self-hostable, it simply wouldn't make sense.",
		icon: <Shield className="w-5 h-5 text-white" />,
	},
	{
		question: "Do I need to log in to use Dione?",
		answer:
			"No login is required. Your experience won't be limited if you choose not to log in. Logging in provides optional benefits like device sync, but even self-hosting requires no keys or complex setup, we've worked hard to keep it truly open and hassle-free.",
		icon: <LogIn className="w-5 h-5 text-white" />,
	},
	{
		question: "What is the current state of Dione?",
		answer:
			"Dione is in early public beta. While many features are already working, you may encounter bugs or rough edges. We're actively improving the platform based on user feedback.",
		icon: <Rocket className="w-5 h-5 text-white" />,
	},
	{
		question: "Which platforms are supported?",
		answer:
			"Dione currently supports Windows. macOS and Linux versions are in active development, and full cross-platform support is a top priority.",
		icon: <Monitor className="w-5 h-5 text-white" />,
	},
	{
		question: "Where can I get help or report bugs?",
		answer:
			"You can join our Discord community to ask questions, report bugs, or share feedback. We're active and always listening.",
		icon: <HelpCircle className="w-5 h-5 text-white" />,
	},
	{
		question: "Can I contribute to Dione?",
		answer:
			"Absolutely! Whether you want to improve the core app or create installation scripts, contributions are welcome. Help with macOS and Linux support is especially appreciated.",
		icon: <Code2 className="w-5 h-5 text-white" />,
	},
	{
		question: "What makes Dione different from other platforms?",
		answer:
			"Dione stands out with its clean UI, ease of use, lightweight install system, frequent updates, and a beginner-friendly scripting language for adding apps. It's built with a community-first approach that prioritizes simplicity, transparency, and extensibility.",
		icon: <Sparkles className="w-5 h-5 text-white" />,
	},
];
