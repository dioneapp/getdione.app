"use client";

import { Plus } from "lucide-react";
import { useMemo } from "react";

type ScriptItem = {
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
};

export default function ExploreCarousel({
	scripts,
}: {
	scripts: ScriptItem[];
}) {
	const displayScripts = useMemo(
		() => (Array.isArray(scripts) ? scripts.slice(0, 20) : []),
		[scripts],
	);

	// split into two rows with different items
	const firstRow = useMemo(
		() => displayScripts.filter((_, idx) => idx % 2 === 0),
		[displayScripts],
	);
	const secondRow = useMemo(
		() => displayScripts.filter((_, idx) => idx % 2 === 1),
		[displayScripts],
	);

	// Base arrays for each row
	const firstRowBase = firstRow;
	const secondRowBase = useMemo(
		() => [...secondRow, { id: -1 } as any],
		[secondRow],
	);
	const copies = 3; // use 3 copies for ultra-smooth infinite loop

	return (
		<section className="w-full max-w-7xl mt-10 relative">
			<div className="space-y-4">
				{/* Top row */}
				<div className="overflow-hidden mask-fade">
					<div className="flex gap-4 animate-scroll will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]">
						{Array.from({ length: copies }).map((_, gIdx) => (
							<div
								key={`top-group-${gIdx}`}
								className="flex gap-4"
								aria-hidden={gIdx > 0}
							>
								{firstRowBase.map((script) => (
									<div
										key={`top-${gIdx}-${script.id}`}
										className="shrink-0 w-[260px] sm:w-[300px]"
									>
										<CarouselCard script={script} />
									</div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Bottom row (reverse) */}
				<div className="overflow-hidden mask-fade">
					<div className="flex gap-4 animate-scroll-reverse will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]">
						{Array.from({ length: copies }).map((_, gIdx) => (
							<div
								key={`bottom-group-${gIdx}`}
								className="flex gap-4"
								aria-hidden={gIdx > 0}
							>
								{secondRowBase.map((script: any, idx: number) => (
									<div
										key={`bottom-${gIdx}-${script.id ?? idx}`}
										className="shrink-0 w-[260px] sm:w-[300px]"
									>
										{script.id === -1 ? (
											<AddYourOwnCard />
										) : (
											<CarouselCard script={script as ScriptItem} />
										)}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>

			<style jsx>{`
        .mask-fade {
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);
                  mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);
          -webkit-mask-size: 100% 100%;
                  mask-size: 100% 100%;
        }
        @keyframes scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333333%, 0, 0); }
        }
        @keyframes scroll-reverse {
          0% { transform: translate3d(-33.333333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-scroll { animation: scroll 60s linear infinite; }
        .animate-scroll-reverse { animation: scroll-reverse 60s linear infinite; }
      `}</style>
		</section>
	);
}

function CarouselCard({ script }: { script: ScriptItem }) {
	const { name, description, logo_url, author, author_url } = script;

	return (
		<article className="group relative p-4 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg h-full flex flex-col overflow-hidden">
			<div className="flex items-center gap-3">
				{logo_url ? (
					<img
						src={logo_url || "/favicon.ico"}
						alt={`${name} logo`}
						className="w-10 h-10 rounded-md object-cover border border-white/10"
					/>
				) : (
					<div>
						<span className="w-10 h-10 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-white font-medium">
							{name.charAt(0).toUpperCase()}
						</span>
					</div>
				)}
				<div className="min-w-0">
					<h3 className="text-white text-base font-medium truncate">{name}</h3>
					<a
						href={author_url}
						className="text-xs text-white/60 hover:text-white/80 transition-colors truncate"
					>
						by {author}
					</a>
				</div>
			</div>

			<p className="mt-3 text-sm text-white/70 line-clamp-3">{description}</p>
		</article>
	);
}

function AddYourOwnCard() {
	return (
		<article className="relative p-4 rounded-xl border border-dashed border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg h-full flex flex-col items-start justify-between">
			<div>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-md flex items-center justify-center bg-white/10 border border-white/10">
						<Plus className="w-5 h-5 text-white" />
					</div>
					<div>
						<h3 className="text-white text-base font-medium">Add your own</h3>
						<p className="text-xs text-white/60">Contribute a new script</p>
					</div>
				</div>
				<p className="mt-3 text-sm text-white/70 line-clamp-4">
					Have an app in mind? Create and publish a Dione script so everyone can
					install it with one click.
				</p>
			</div>
			<a
				href="https://docs.getdione.app/developer-guide/creating-a-dione-script"
				target="_blank"
				rel="noopener noreferrer"
				className="absolute inset-0"
				aria-label="Read the developer guide to create a Dione script"
			/>
		</article>
	);
}
