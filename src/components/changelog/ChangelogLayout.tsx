import type { ReactNode } from "react";

export default function ChangelogLayout({ children }: { children: ReactNode }) {
	return (
		<main>
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				></div>
				<h1 className="text-5xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
					Changelog
				</h1>
				<p
					className="mt-4 mb-12 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4"
					style={{ textRendering: "optimizeLegibility" }}
				>
					Latest changes to Dione directly from GitHub.
				</p>
				{children}
				<p className="text-center text-sm text-white/70 mt-8 max-md:text-balance">
					Check out the{" "}
					<a
						href="https://github.com/dioneapp/dioneapp/releases"
						target="_blank"
						rel="noreferrer noopener"
						className="underline"
					>
						Dione GitHub repository
					</a>{" "}
					for more details.
				</p>
			</div>
		</main>
	);
}
