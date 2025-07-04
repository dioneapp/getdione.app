import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React from "react";

type FAQ = {
	question: string;
	answer: string;
};

type FAQProps = {
	faq: FAQ[];
	openItems: number[];
	toggleItem: (index: number) => void;
};

export default function FAQ({ faq, openItems, toggleItem }: FAQProps) {
	return (
		<section
			className="w-full max-w-4xl mx-auto mt-16 px-4"
			aria-labelledby="faq-heading"
		>
			<h2
				id="faq-heading"
				className="text-3xl sm:text-4xl font-semibold text-white text-center mb-12"
			>
				Frequently Asked Questions
			</h2>
			<div className="grid gap-4">
				{faq.map((item, index) => (
					<article
						key={index}
						className={`group rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden ${openItems.includes(index) ? "border-white/30" : ""}`}
					>
						<button
							onClick={() => toggleItem(index)}
							className="w-full p-6 text-left flex items-center justify-between text-white hover:text-white/90 transition-all duration-200 cursor-pointer"
							aria-expanded={openItems.includes(index)}
							aria-controls={`faq-answer-${index}`}
						>
							<span className="font-semibold text-lg pr-4 leading-tight">
								{item.question}
							</span>
							<div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-200">
								<ChevronDown
									className={`w-4 h-4 transition-transform duration-300 ${openItems.includes(index) ? "rotate-180" : ""}`}
								/>
							</div>
						</button>
						<AnimatePresence initial={false}>
							{openItems.includes(index) && (
								<motion.div
									id={`faq-answer-${index}`}
									initial={{ height: 0, opacity: 0, scale: 0.95 }}
									animate={{ height: "auto", opacity: 1, scale: 1 }}
									exit={{ height: 0, opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
									className="overflow-hidden"
								>
									<div className="px-6 pb-6">
										<div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
										<p className="text-white/90 leading-relaxed text-base">
											{item.answer}
										</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</article>
				))}
			</div>
		</section>
	);
}
