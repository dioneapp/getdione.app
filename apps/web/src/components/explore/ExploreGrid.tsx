import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import ExploreCard from "./ExploreCard";
import ExploreCardSkeleton from "./ExploreCardSkeleton";
import ExploreModal from "./ExploreModal";

interface CardProps {
	id: number;
	name: string;
	description: string;
	author: string;
	author_url: string;
	logo_url: string;
	banner_url: string;
	script_url: string;
	version: string;
	tags: string[];
	likes: number;
	downloads: number;
	created_at: string;
	updated_at: string;
	og_author?: string;
}

export default function ExploreGrid({
	scripts,
	isLoading,
}: {
	scripts: CardProps[];
	isLoading?: boolean;
}) {
	const [selectedScript, setSelectedScript] = useState<CardProps | null>(null);

	// organize scripts into columns but keep the order
	const distributeScripts = (scripts: CardProps[], numColumns: number) => {
		const columns: CardProps[][] = Array.from({ length: numColumns }, () => []);
		scripts.forEach((script, index) => {
			columns[index % numColumns].push(script);
		});
		return columns;
	};

	return (
		<>
			<AnimatePresence>
				{selectedScript && (
					<ExploreModal
						script={selectedScript}
						setSelectedScript={setSelectedScript}
					/>
				)}
			</AnimatePresence>
			<section
				className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl w-full"
				aria-labelledby="features-heading"
			>
				{isLoading ? (
					<>
						{Array.from({
							length: scripts.length > 0 ? scripts.length : 8,
						}).map((_, index) => (
							<div key={`skeleton-${index}`} className="w-full">
								<ExploreCardSkeleton />
							</div>
						))}
					</>
				) : scripts && scripts.length > 0 ? (
					<>
						{distributeScripts(scripts, 4).map((column, columnIndex) => (
							<div
								key={`column-${columnIndex}`}
								className="flex flex-col gap-4"
							>
								{column.map((script) => (
									<div key={script.id} className="w-full">
										<ExploreCard
											{...script}
											setOpenModal={(open) =>
												setSelectedScript(open ? script : null)
											}
										/>
									</div>
								))}
							</div>
						))}
					</>
				) : (
					<div className="col-span-full text-center py-8">
						<p className="text-white/60">No scripts available</p>
					</div>
				)}
			</section>
		</>
	);
}
