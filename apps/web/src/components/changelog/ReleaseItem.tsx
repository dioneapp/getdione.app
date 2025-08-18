import { Calendar, ExternalLink, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Release } from "@/app/server/changelog";

interface ReleaseItemProps {
	release: Release;
}

export default function ReleaseItem({ release }: ReleaseItemProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<article
			key={release.id}
			className="group relative border border-white/10 p-4 sm:p-6 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg"
		>
			<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
				<div className="flex flex-col sm:flex-row sm:w-full sm:items-start sm:justify-between gap-3 sm:gap-0">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
						<div className="flex items-center gap-2">
							<Tag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
							<h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
								{release.name}
							</h1>
						</div>
						{release.prerelease && (
							<span className="px-2 py-1 text-xs bg-orange-500/10 text-orange-300 rounded-full self-start sm:self-center">
								Pre-release
							</span>
						)}
					</div>
					<div className="flex flex-col sm:items-end text-xs sm:text-sm text-white/70 gap-1 sm:gap-0">
						<a
							href={release.html_url}
							target="_blank"
							rel="noreferrer noopener"
							className="flex items-center gap-1 text-xs sm:text-sm text-white hover:text-white/80 transition-colors"
						>
							<ExternalLink className="h-3 w-3" />
							View on GitHub
						</a>
						<div className="flex items-center gap-1">
							<Calendar className="h-3 w-3" />
							<time dateTime={release.published_at}>
								{formatDate(release.published_at)}
							</time>
						</div>

					</div>
				</div>
			</header>
			<div className="border-b border-white/10 mb-4 sm:mb-6 mt-3 w-full" />
			<div className="prose prose-sm prose-white max-w-none">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
						h1: ({ children }) => (
							<h1 className="text-base sm:text-lg font-semibold text-white mb-2 mt-4 first:mt-0">
								{children}
							</h1>
						),
						h2: ({ children }) => (
							<h2 className="text-sm sm:text-base font-semibold text-white mb-2 mt-4 first:mt-0">
								{children}
							</h2>
						),
						h3: ({ children }) => (
							<h3 className="text-xs sm:text-sm font-semibold text-white mb-2 mt-3 first:mt-0">
								{children}
							</h3>
						),
						p: ({ children }) => (
							<p className="text-xs sm:text-sm text-white/70 mb-3 leading-relaxed">{children}</p>
						),
						a: ({ href, children }) => (
							<a
								href={href}
								target="_blank"
								rel="noreferrer noopener"
								className="text-[#BCB1E7] hover:text-[#BCB1E7]/80 underline underline-offset-2 transition-color"
							>
								{children}
							</a>
						),
						ul: ({ children }) => (
							<ul className="space-y-1 mb-3 pl-4">{children}</ul>
						),
						ol: ({ children }) => (
							<ol className="space-y-1 mb-3 pl-4">{children}</ol>
						),
						li: ({ children }) => (
							<li className="text-xs sm:text-sm text-white/70 relative">
								<span className="rounded-full bg-white/80 absolute w-1 h-1 -left-4 top-2"></span>
								{children}
							</li>
						),
						code: ({ children, className }) => {
							const isInline = !className;
							if (isInline) {
								return (
									<code className="px-1.5 py-0.5 bg-white/10 text-white/70 rounded text-xs font-mono">
										{children}
									</code>
								);
							}
							return (
								<pre className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 overflow-x-auto mb-3">
									<code className="text-xs sm:text-sm font-mono text-white/70">
										{children}
									</code>
								</pre>
							);
						},
						blockquote: ({ children }) => (
							<blockquote className="border-l-4 border-white/10 pl-3 sm:pl-4 italic text-xs sm:text-sm text-white/70 my-3">
								{children}
							</blockquote>
						),
						img: ({ src, alt }) => (
							<div className="my-4">
								<img
									src={src}
									alt={alt}
									className="max-w-full h-auto rounded-lg border border-white/10 shadow-sm"
								/>
								{alt && (
									<p className="text-xs text-white/70 mt-2 text-center italic">
										{alt}
									</p>
								)}
							</div>
						),
						table: ({ children }) => (
							<div className="overflow-x-auto my-4">
								<table className="min-w-full border border-white/10 rounded-lg">
									{children}
								</table>
							</div>
						),
						th: ({ children }) => (
							<th className="px-3 sm:px-4 py-2 bg-white/5 border-b border-white/10 text-left text-xs sm:text-sm font-medium text-white">
								{children}
							</th>
						),
						td: ({ children }) => (
							<td className="px-3 sm:px-4 py-2 border-b border-white/10 text-xs sm:text-sm text-white/70">
								{children}
							</td>
						),
					}}
				>
					{release.body}
				</ReactMarkdown>
			</div>
		</article>
	);
}
