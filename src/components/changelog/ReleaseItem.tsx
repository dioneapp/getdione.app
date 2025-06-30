import { Release } from "@/app/server/changelog";
import ReactMarkdown from "react-markdown";

export default function ReleaseItem({ release }: { release: Release }) {
	return (
		<article
			className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg"
		>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg sm:text-xl font-medium text-white">
					{release.name}
				</h3>
				<a
					href={release.html_url}
					target="_blank"
					rel="noreferrer noopener"
					className="text-sm text-white/70 hover:text-white/90 transition-colors"
				>
					view on github
				</a>
			</div>
			<div className="text-sm sm:text-base prose prose-invert prose-a:text-blue-400 prose-a:underline">
				<ReactMarkdown>{release.body}</ReactMarkdown>
			</div>
		</article>
	);
} 