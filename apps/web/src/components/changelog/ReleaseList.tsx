import type { Release } from "@/app/server/changelog";
import ReleaseItem from "@/components/changelog/ReleaseItem";

export default function ReleaseList({ releases }: { releases: Release[] }) {
	if (!releases.length) {
		return (
			<p className="text-center text-xs sm:text-sm text-white/70 justify-center items-center mt-auto mb-16 sm:mb-24 flex">
				No releases found.
			</p>
		);
	}
	return (
		<section
			className="mt-auto grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 max-w-4xl w-full"
			aria-labelledby="features-heading"
		>
			{releases.map((release) => (
				<ReleaseItem key={release.name} release={release} />
			))}
		</section>
	);
}
