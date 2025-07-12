import ExploreCard from "./ExploreCard";

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

export default function ExploreGrid({ scripts }: { scripts: CardProps[] }) {
	return (
		<section
			className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl"
			aria-labelledby="features-heading"
		>
			{scripts.map((script) => (
				<ExploreCard key={script.id} {...script} />
			))}
		</section>
	);
}
