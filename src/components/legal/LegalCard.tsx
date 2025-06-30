import type { ReactNode } from "react";

interface LegalCardProps {
	title: string;
	children: ReactNode;
}

export default function LegalCard({ title, children }: LegalCardProps) {
	return (
		<article className="group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg">
			<h2 className="text-xl sm:text-2xl font-medium text-white mb-4">
				{title}
			</h2>
			<div className="text-white/80 leading-relaxed space-y-4">{children}</div>
		</article>
	);
}