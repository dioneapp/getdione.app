"use client"

import ExploreFooter from "@/components/explore/ExploreFooter";
import ExploreGrid from "@/components/explore/ExploreGrid";
import ExploreHeader from "@/components/explore/ExploreHeader";
import { getScripts } from "@/utils/getScripts";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function ExplorePage() {
	const [orderBy, setOrderBy] = useState<string>()
	const [scripts, setScripts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchScripts() {
			setLoading(true);
			const data = await getScripts(orderBy);
			setScripts(data);
			setLoading(false);
		}
		fetchScripts();
	}, [orderBy]);

	return (
		<main>
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-16 sm:pt-20 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				/>

				<ExploreHeader setOrderBy={setOrderBy} orderBy={orderBy || "downloads"} />
				<ExploreGrid scripts={scripts} isLoading={loading} />
				<ExploreFooter />
			</div>
		</main>
	);
}
