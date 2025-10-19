import Link from "next/link";

// footer data
const footerData = {
	brand: {
		name: "Dione",
		description:
			"Your gateway to open-source AI applications. Simple, powerful, and community-driven.",
	},
	sections: [
		{
			title: "Quick Links",
			links: [
				{ label: "Explore", href: "/explore" },
				{ label: "Changelog", href: "/changelog" },
				{
					label: "Documentation",
					href: "https://docs.getdione.app",
					external: true,
				},
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Terms Of Use", href: "/legal/terms-use" },
				{ label: "Privacy Policy", href: "/legal/privacy-policy" },
			],
		},
	],
	social: [
		{
			href: "https://github.com/dioneapp",
			label: "GitHub",
			icon: (
				<svg
					className="w-5 h-5"
					viewBox="0 0 256 250"
					width="256"
					height="250"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid"
				>
					<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
				</svg>
			),
		},
		{
			href: "https://discord.gg/JSAszyCEW5",
			label: "Discord",
			icon: (
				<svg
					className="w-5 h-5"
					viewBox="0 0 256 199"
					width="256"
					height="199"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid"
				>
					<path
						d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
						fill="currentColor"
					/>
				</svg>
			),
		},
	],
};

export default function Footer() {
	return (
		<footer className="w-full relative bg-black/20 backdrop-blur-sm z-20 mt-auto">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
					{/* Left: Brand and description */}
					<div className="lg:col-span-1 space-y-4">
						<h2 className="text-xl font-semibold text-white">
							{footerData.brand.name}
						</h2>
						<p className="text-sm text-white/70 max-w-sm">
							{footerData.brand.description}
						</p>

						<div className="flex gap-4 pt-2">
							{footerData.social.map(({ href, label, icon }) => (
								<Link
									key={href}
									href={href}
									aria-label={label}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-colors duration-200"
								>
									{icon}
								</Link>
							))}
						</div>
						<p className="text-sm text-white/40 pt-2">
							© {new Date().getFullYear()} {footerData.brand.name}. All rights
							reserved.
						</p>
					</div>

					{/* Right: Links columns */}
					<div className="lg:col-span-2 grid grid-cols-2 gap-8 lg:gap-12 lg:pl-12">
						{footerData.sections.map(({ title, links }) => (
							<div key={title} className="space-y-4">
								<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
									{title}
								</h3>
								<ul className="space-y-3">
									{links.map(({ href, label, external }) => (
										<li key={href}>
											<Link
												href={href}
												target={external ? "_blank" : undefined}
												rel={external ? "noopener noreferrer" : undefined}
												className="text-sm text-white/70 hover:text-white transition-colors"
											>
												{label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
