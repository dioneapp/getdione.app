"use client";

import type { ExtendedUser } from "@/types/database";
import { supabase } from "@/utils/database";
import useSession from "@/utils/supabase/use-session";
import type { Session, User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// client-side only wrapper
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return <>{children}</>;
};

// navigation links
const links = [
	{ label: "Explore", href: "/explore" },
	{ label: "Changelog", href: "/changelog", external: false },
	// { label: "Documentation", href: "https://docs.getdione.app", external: true },
];

// add moderation link if user is moderator
const getNavigationLinks = (isModerator: boolean) => {
	const baseLinks = [...links];
	if (isModerator) {
		baseLinks.push({ label: "Moderation", href: "/moderation" });
	}
	return baseLinks;
};

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [isModerator, setIsModerator] = useState(false);
	const { session } = useSession();

	// handle mobile menu
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		document.body.style.overflow = !isMenuOpen ? "hidden" : "";
	};

	useEffect(() => {
		if (!session) return;

		setUser(session.user);
		// check moderator status
		supabase
			.from("users")
			.select("moderator")
			.eq("id", session.user.id)
			.single()
			.then(({ data }) => {
				setIsModerator(data?.moderator ?? false);
			});
	}, [session]);

	// get user data and moderator status
	useEffect(() => {
		let mounted = true;

		// listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!mounted) return;

			setUser(session?.user ?? null);

			// only check moderator status if user is logged in
			if (session?.user) {
				const { data: userData } = await supabase
					.from("users")
					.select("moderator")
					.eq("id", session.user.id)
					.single();

				if (mounted) {
					setIsModerator(userData?.moderator ?? false);
				}
			} else {
				setIsModerator(false);
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const fullName = user?.user_metadata?.full_name || user?.email;
	const avatarUrl = user?.user_metadata?.avatar_url;

	const navigationLinks = getNavigationLinks(isModerator);

	return (
		<nav className="fixed top-0 w-full z-50 px-6 py-4">
			<div className="max-w-7xl mx-auto">
				<div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-full px-4 py-3 flex items-center justify-between shadow-lg shadow-black/10">
					<div className="flex items-center gap-3">
						<button
							onClick={toggleMenu}
							className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
							aria-label="Toggle mobile menu"
							aria-controls="mobile-menu"
							aria-expanded={isMenuOpen}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>

						<Link
							href="/"
							className="flex items-center justify-center px-4 py-2 gap-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
						>
							<svg
								className="w-6 h-6"
								width="525"
								height="555"
								viewBox="0 0 525 555"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle cx="262.5" cy="262.5" r="262.5" fill="white" />
								<circle cx="164" cy="506" r="49" fill="white" />
								<circle cx="359" cy="506" r="49" fill="white" />
								<circle cx="105.483" cy="202.109" r="23.3512" fill="#080808" />
								<circle cx="294.161" cy="202.109" r="23.3512" fill="#080808" />
								<rect
									x="148"
									y="179"
									width="104.613"
									height="46.7025"
									rx="23.3512"
									fill="#080808"
								/>
							</svg>
							<span className="font-semibold text-white group-hover:text-white">
								Dione
							</span>
						</Link>
					</div>

					<div className="flex items-center gap-3">
						<div className="hidden md:flex items-center gap-6">
							{navigationLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									target={link.external ? "_blank" : undefined}
									className="text-sm text-white/70 hover:text-white transition-colors"
								>
									{link.label}
								</Link>
							))}
						</div>

						<div className="h-6 w-[1px] bg-white/10 hidden md:block" />
						{session !== null ? (
							<Link
								href="/profile"
								className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
							>
								{avatarUrl ? (
									<Image
										src={avatarUrl}
										alt="Profile"
										width={24}
										height={24}
										className="rounded-full"
									/>
								) : (
									<div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">
										{fullName?.charAt(0).toUpperCase()}
									</div>
								)}
								<span className="text-sm font-medium">{fullName}</span>
							</Link>
						) : (
							<Link
								href="/auth/login"
								className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24"
									viewBox="0 -960 960 960"
									width="24"
									fill="currentColor"
								>
									<path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z" />
								</svg>
								<span className="text-sm font-medium">Log In</span>
							</Link>
						)}

						<Link
							href="https://discord.gg/JSAszyCEW5"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Join our Discord community"
							className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
						>
							<svg
								className="w-5 h-5"
								viewBox="0 0 256 199"
								width="256"
								height="199"
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="xMidYMid"
								aria-hidden="true"
							>
								<path
									d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
									fill="currentColor"
								/>
							</svg>
						</Link>
						<Link
							href="https://github.com/dioneapp"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 w-9 h-9 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
							aria-label="View Dione source code on GitHub"
						>
							<svg
								className="w-5 h-5"
								viewBox="0 0 256 250"
								width="256"
								height="250"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="xMidYMid"
								aria-hidden="true"
							>
								<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
							</svg>
							<span className="sr-only">View Dione on GitHub</span>
						</Link>
					</div>
				</div>
			</div>

			{/* mobile menu */}
			<ClientOnly>
				<div
					id="mobile-menu"
					className={`fixed inset-0 bg-black/90 backdrop-blur-md ${
						isMenuOpen ? "block" : "hidden"
					} md:hidden z-50`}
					aria-modal="true"
					aria-hidden={!isMenuOpen}
					role="dialog"
				>
					<button
						onClick={toggleMenu}
						className="absolute top-8 left-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
						aria-label="Close mobile menu"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<div className="flex flex-col items-center justify-center h-full gap-8">
						{navigationLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								onClick={toggleMenu}
								className="text-xl text-white/70 hover:text-white transition-colors"
							>
								{link.label}
							</Link>
						))}
						{session ? (
							<Link
								href="/profile"
								onClick={toggleMenu}
								className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
							>
								{avatarUrl ? (
									<Image
										src={avatarUrl}
										alt="Profile"
										width={24}
										height={24}
										className="rounded-full"
									/>
								) : (
									<div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">
										{fullName?.charAt(0).toUpperCase()}
									</div>
								)}
								<span className="text-xl font-medium">{fullName}</span>
							</Link>
						) : (
							<Link
								href="/auth/login"
								onClick={toggleMenu}
								className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24"
									viewBox="0 -960 960 960"
									width="24"
									fill="currentColor"
								>
									<path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z" />
								</svg>
								<span className="text-xl font-medium">Log In</span>
							</Link>
						)}
					</div>
				</div>
			</ClientOnly>
		</nav>
	);
}
