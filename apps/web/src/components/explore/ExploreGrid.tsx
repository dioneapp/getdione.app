import ExploreCard from "./ExploreCard";
import ExploreCardSkeleton from "./ExploreCardSkeleton";

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
}

export default function ExploreGrid({ scripts, isLoading }: { scripts: CardProps[]; isLoading?: boolean }) {
	return (
		<section
			className="mt-8 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 max-w-7xl space-y-4 w-full"
			aria-labelledby="features-heading"
		>
			{isLoading ? (
				<>
					{Array.from({ length: scripts.length > 0 ? scripts.length : 8 }).map((_, index) => (
						<div key={`skeleton-${index}`} className="break-inside-avoid mb-4 w-full">
							<ExploreCardSkeleton />
						</div>
					))}
				</>
			) : scripts && scripts.length > 0 ? (
				<>
					{scripts.map((script) => (
						<div key={script.id} className="break-inside-avoid mb-4">
							<ExploreCard {...script} />
						</div>
					))}
				</>
			) : (
				<div className="col-span-full text-center py-8">
					<p className="text-white/60">No scripts available</p>
				</div>
			)}
		</section>
	)
}