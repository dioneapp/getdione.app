"use client"

import { Calendar, Download, Tag, ThumbsUp } from "lucide-react";

interface ScriptData {
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

interface CardProps extends ScriptData {
	setOpenModal: (script: ScriptData | null) => void;
}

export default function ExploreCard({
	id,
	name,
	description,
	author,
	author_url,
	logo_url,
	banner_url,
	script_url,
	tags,
	version,
	likes,
	downloads,
	created_at,
	updated_at,
	setOpenModal,
}: CardProps) {
	const script: ScriptData = { id, name, description, author, author_url, logo_url, banner_url, script_url, version, tags, likes, downloads, created_at, updated_at };
	const formattedDate = new Date(created_at).toLocaleDateString();

	return (
		<article
			onClick={() => setOpenModal && setOpenModal(script)}
			className="group relative p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg cursor-pointer w-full h-full flex flex-col"
		>
			{/* {banner_url && (
				<div
					className="absolute top-0 left-0 w-full h-24 rounded-t-xl bg-cover bg-center bg-no-repeat blur-xl opacity-40 -z-10"
					style={{ backgroundImage: `url(${banner_url})` }}
				/>
			)} */}

			<div className="relative z-10 flex flex-col h-full">
				<div className="flex items-center gap-4 mb-4">
					{logo_url ? (					
						<img
							src={logo_url || "/favicon.ico"}
							alt={`${name} logo`}
							className="w-12 h-12 rounded-md object-cover"
						/>
					): (
						<div>
							<span className="w-10 h-10 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-white font-medium">
								{name.charAt(0).toUpperCase()}
							</span>
						</div>
					)}
					<div>
						<h3 className="text-lg sm:text-xl font-medium text-white">
							{name}
						</h3>
						<a
							href={author_url}
							className="text-sm text-white/60 hover:text-white/80 transition-colors"
						>
							{author}
						</a>
					</div>
				</div>

				<div className="flex-1 flex flex-col">
					<p className="text-sm sm:text-base text-white/70 mb-4">
						{description}
					</p>

					<div className="mt-auto pt-3">
						<div className="flex justify-between items-center text-xs text-neutral-400">
							<div className="flex items-center gap-4">
								{version && (
									<span className="flex items-center">
										<Tag className="w-4 h-4 mr-1" />v{version}
									</span>
								)}
								<span className="flex items-center">
									<Calendar className="w-4 h-4 mr-1" />
									{formattedDate}
								</span>
							</div>

							<div className="flex items-center gap-2">
								{/* <span className="flex items-center">
									<ThumbsUp className="w-4 h-4 mr-1" />
									{likes}
								</span> */}
								<span className="flex items-center">
									<Download className="w-4 h-4 mr-1" />
									{downloads}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
