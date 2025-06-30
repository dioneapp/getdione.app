import ExploreCard from "./ExploreCard";

export default function ExploreGrid({ scripts }) {
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