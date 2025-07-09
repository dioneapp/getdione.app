import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import type { Release } from "@/app/server/changelog";

interface ReleaseItemProps {
  release: Release;
}

export default function ReleaseItem({ release }: ReleaseItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article key={release.id} className="group relative border border-white/10 p-6 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
      <header className="flex items-center justify-between">
	  <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-white" />
            <h1 className="text-4xl font-semibold text-white">
              {release.name}
            </h1>
            {release.prerelease && (
              <span className="px-2 py-1 text-xs bg-orange-500/10 text-orange-300 rounded-full mb-2">
                Pre-release
              </span>
            )}
          </div>
          <div className="flex flex-col items-end text-sm text-white/70">
			<a
				href={release.html_url}
				target="_blank"
				rel="noreferrer noopener"
				className="flex items-center gap-1 text-sm text-white hover:text-white/80 transition-colors"
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
				<code className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono mt-2">
				{release.tag_name}
				</code>
			</div>
			</div>
      </header>
	  <div className="border-b border-white/10 mb-6 mt-3 w-full"/>
      <div className="prose prose-sm prose-white max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-lg font-semibold text-white mb-2 mt-4 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-semibold text-white mb-2 mt-4 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-white mb-2 mt-3 first:mt-0">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-white/70 mb-3 leading-relaxed">
                {children}
              </p>
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
              <ul className="space-y-1 mb-3 pl-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-1 mb-3 pl-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-white/70 relative">
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
                <pre className="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto mb-3">
                  <code className="text-sm font-mono text-white/70">
                    {children}
                  </code>
                </pre>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-white/10 pl-4 italic text-white/70 my-3">
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
              <th className="px-4 py-2 bg-white/5 border-b border-white/10 text-left text-sm font-medium text-white">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 border-b border-white/10 text-sm text-white/70">
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