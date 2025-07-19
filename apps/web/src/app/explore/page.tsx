import ExploreFooter from "@/components/explore/ExploreFooter";
import ExploreGrid from "@/components/explore/ExploreGrid";
import ExploreHeader from "@/components/explore/ExploreHeader";
import { getScripts } from "@/utils/getScripts";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
	const scripts = await getScripts();

	return (
		<main>
			<div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
				<div
					className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
					aria-hidden="true"
				/>

				<ExploreHeader />
				<ExploreGrid scripts={scripts} />
				<ExploreFooter />
			</div>
		</main>
	);
}
