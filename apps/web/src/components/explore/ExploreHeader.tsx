"use client";

import { useEffect, useState } from "react";

interface ExploreHeaderProps {
	setOrderBy: (orderBy: string) => void;
	orderBy: string;
}
export default function ExploreHeader({
	setOrderBy,
	orderBy,
}: ExploreHeaderProps) {
	const defaultOptions = ["latest", "downloads", "likes"];

	const getExploreText = (orderBy: string) => {
		switch (orderBy) {
			case "latest":
				return "latest available";
			case "downloads":
				return "most downloaded";
			case "likes":
				return "most liked";
			default:
				return "latest available";
		}
	};

	return (
		<>
			<h1 className="text-center font-medium tracking-tighter text-5xl xl:text-6xl max-w-4xl text-balance whitespace-pre-line">
				Download any of these apps with one click
			</h1>
			<p
				className="mt-6 max-w-xl text-center text-base sm:text-md text-neutral-300 leading-relaxed text-balance px-4"
				onClick={() => {
					const currentIndex = defaultOptions.indexOf(
						orderBy || defaultOptions[0],
					);
					const nextIndex = (currentIndex + 1) % defaultOptions.length;
					setOrderBy(defaultOptions[nextIndex]);
				}}
			>
				Explore the{" "}
				<span className="text-neutral-200 hover:text-white transition-colors duration-300 underline underline-offset-3 cursor-pointer">
					{getExploreText(orderBy || defaultOptions[1])}
				</span>{" "}
				apps at Dione.
			</p>
		</>
	);
}
