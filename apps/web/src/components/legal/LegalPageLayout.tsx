import type { ReactNode } from "react";

interface LegalPageLayoutProps {
	title: string;
	updatedDate: string;
	children: ReactNode;
}

export default function LegalPageLayout({
	title,
	updatedDate,
	children,
}: LegalPageLayoutProps) {
	return (
		<main>
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-16 sm:pt-20 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				></div>

				<h1 className="text-5xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					{title}
				</h1>
				<p
					className="mt-4 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4"
					style={{ textRendering: "optimizeLegibility" }}
				>
					Updated: {updatedDate}
				</p>

				<section
					className="grid grid-cols-1 gap-4 sm:gap-6 mt-8 px-4 max-w-4xl w-full"
					aria-labelledby="features-heading"
				>
					{children}
				</section>
			</div>
		</main>
	);
}
