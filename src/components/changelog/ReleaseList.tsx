import { Release } from "@/app/server/changelog";
import ReleaseItem from "@/components/changelog/ReleaseItem";

export default function ReleaseList({ releases }: { releases: Release[] }) {
	if (!releases.length) {
		return (
			<p className="text-center text-sm text-white/70 justify-center items-center mt-auto mb-24 flex">
				no releases found.
			</p>
		);
	}
	return (
		<section
			className="mt-auto grid grid-cols-1 gap-4 sm:gap-6 px-4 max-w-4xl w-full"
			aria-labelledby="features-heading"
		>
			{releases.map((release) => (
				<ReleaseItem key={release.name} release={release} />
			))}
		</section>
	);
} 