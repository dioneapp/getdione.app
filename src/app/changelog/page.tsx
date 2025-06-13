"use client";

import { marked } from "marked";
import { useEffect, useState } from "react";

export default function ChangelogPage() {
	const [releases, setReleases] = useState([]);

	useEffect(() => {
		fetch("/api/releases")
			.then((res) => res.json())
			.then(setReleases)
			.catch(() => setReleases([]));
	}, []);

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
				{releases.length === 0 && (
					<p className="text-center text-sm text-white/70 justify-center items-center mt-auto mb-24 flex">
						No releases found.
					</p>
				)}

				<section
					className="mt-auto grid grid-cols-1 gap-4 sm:gap-6 px-4 max-w-4xl w-full"
					aria-labelledby="features-heading"
				>
					{releases.length > 0 && releases.map(
						(release: { name: string; html_url: string; body: string }) => (
							<article
								key={release.name}
								className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg"
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg sm:text-xl font-medium text-white">
										{release.name}
									</h3>
									<a
										href={release.html_url}
										target="_blank"
										rel="noreferrer noopener"
										className="text-sm text-white/70 hover:text-white/90 transition-colors"
									>
										View on GitHub
									</a>
								</div>
								<div
									className="text-sm sm:text-base text-white/70 prose"
									dangerouslySetInnerHTML={{
										__html: marked.parse(release.body),
									}}
								/>
							</article>
						),
					)}
				</section>
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
