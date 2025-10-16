"use client";
import { useEffect, useState } from "react";

export default function ExploreCardSkeleton() {
	const [randomHeight, setRandomHeight] = useState<number | null>(null);
	const [descriptionLines, setDescriptionLines] = useState<number | null>(null);

	useEffect(() => {
		setRandomHeight(Math.floor(Math.random() * (400 - 200 + 1)) + 200);
		setDescriptionLines(Math.floor(Math.random() * 4) + 2);
	}, []);

	if (randomHeight === null || descriptionLines === null) {
		return (
			<div className="w-full h-[250px] animate-pulse rounded-xl bg-white/5" />
		);
	}

	return (
		<article
			className="group relative p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 w-full flex flex-col animate-pulse"
			style={{ minHeight: `${randomHeight}px` }}
		>
			<div className="relative z-10 flex flex-col h-full w-full">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-12 h-12 rounded-md bg-white/10" />
					<div className="flex-1">
						<div className="h-6 bg-white/10 rounded mb-2 w-3/4" />
						<div className="h-4 bg-white/10 rounded w-1/2" />
					</div>
				</div>
				<div className="flex-1 flex flex-col">
					<div className="space-y-2 mb-4">
						{Array.from({ length: descriptionLines }).map((_, index) => (
							<div
								key={index}
								className="h-4 bg-white/10 rounded"
								style={{
									width: `${Math.floor(Math.random() * 40) + 60}%`,
								}}
							/>
						))}
					</div>
					<div className="mt-auto pt-3">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-4">
								<div className="h-4 bg-white/10 rounded w-12" />
								<div className="h-4 bg-white/10 rounded w-16" />
							</div>
							<div className="flex items-center gap-2">
								<div className="h-4 bg-white/10 rounded w-8" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
