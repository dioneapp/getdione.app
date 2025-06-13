"use client";

import type { ExtendedUser } from "@/types/database";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

// public fields that are safe to expose
const PUBLIC_FIELDS = [
	"username",
	"first_name",
	"bio",
	"location",
	"avatar_url",
	"created_at",
	"tester",
	"publisher",
	"moderator",
];

export default function UserProfilePage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();
	const { session, profile: currentUserProfile } = useSession();
	const [user, setUser] = useState<ExtendedUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { username } = use(params);

	// fetch user data
	useEffect(() => {
		let mounted = true;

		const fetchUser = async () => {
			try {
				// fetch only public user data by username
				const { data: profileData, error: profileError } = await supabase
					.from("users")
					.select(PUBLIC_FIELDS.join(","))
					.eq("username", username)
					.single();

				if (!mounted) return;

				if (profileError) {
					console.error("Profile fetch error:", profileError);
					throw new Error("User not found");
				}

				if (!profileData) {
					throw new Error("No profile data found");
				}

				// type check the profile data
				if (typeof profileData === "object" && !("error" in profileData)) {
					setUser(profileData as ExtendedUser);
				} else {
					throw new Error("Invalid profile data format");
				}
			} catch (err) {
				if (!mounted) return;
				console.error("Fetch error:", err);
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred. Please try again later.");
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		fetchUser();

		return () => {
			mounted = false;
		};
	}, [username, supabase]);

	// show loading state
	if (loading) {
		return (
			<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
				<div
					className="fixed inset-0 flex justify-center items-center"
					aria-hidden="true"
				>
					<div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
				</div>
				<div className="h-fit w-full flex max-w-xl">
					<div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
						<h1 className="text-white text-3xl font-semibold">Loading...</h1>
					</div>
				</div>
			</div>
		);
	}

	// show error state
	if (error) {
		return (
			<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
				<div
					className="fixed inset-0 flex justify-center items-center"
					aria-hidden="true"
				>
					<div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
				</div>
				<div className="h-fit w-full flex max-w-xl">
					<div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
						<h1 className="text-white text-3xl font-semibold">Error</h1>
						<p className="mt-2 text-red-400">{error}</p>
						<button
							onClick={() => router.push("/")}
							className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
						>
							Return Home
						</button>
					</div>
				</div>
			</div>
		);
	}

	// show profile
	return (
		<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-24 relative">
			{/* background elements */}
			<div
				className="fixed inset-0 flex justify-center items-center"
				aria-hidden="true"
			>
				<div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
			</div>

			{/* main container */}
			<div className="h-fit w-full flex max-w-xl">
				<div className="w-full h-full group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg shadow-black/10">
					{/* profile header */}
					<div className="flex flex-col gap-2">
						<div className="flex gap-4 items-center">
							{/* avatar */}
							<div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
								{user?.avatar_url ? (
									<Image
										src={user.avatar_url}
										alt="Profile"
										fill
										className="object-cover"
										sizes="(max-width: 768px) 80px, 80px"
									/>
								) : (
									<div className="w-full h-full bg-white/10 flex items-center justify-center">
										<span className="text-white/50 text-2xl">
											{user?.username?.[0]?.toUpperCase() || "?"}
										</span>
									</div>
								)}
							</div>
							<div className="flex-1">
								<div className="flex flex-col gap-1">
									<div className="text-white text-3xl font-semibold truncate max-w-[300px]">
										{user?.first_name || "No name set"}
									</div>
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white/50 text-sm truncate max-w-[300px]">
										<span className="flex items-center">
											<span>@</span>
											{user?.username || "anonymous"}
										</span>
										{/* location display */}
										{user?.location && (
											<>
												<span className="text-white/20 hidden sm:inline">
													•
												</span>
												<div className="flex items-center gap-1 sm:inline-flex">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-3.5 w-3.5"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
															clipRule="evenodd"
														/>
													</svg>
													<span className="text-white/70">
														{user?.location}
													</span>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* bio section */}
						<div className="mt-6 space-y-4">
							<div className="p-4 rounded-lg bg-white/5 border border-white/10">
								<div className="space-y-4">
									<div>
										<h2 className="text-white/50 text-sm">About</h2>
										<p className="text-white whitespace-pre-wrap line-clamp-4">
											{user?.bio || "No bio yet"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* account info section */}
					<div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-white/50 text-sm">Member Since</p>
								<div className="relative inline-block cursor-pointer">
									<div className="peer">
										<p className="text-white">
											{user?.created_at
												? new Date(user.created_at).toLocaleDateString()
												: "N/A"}
										</p>
									</div>
									<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
										{user?.created_at
											? new Date(user.created_at).toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})
											: "N/A"}
									</div>
								</div>
							</div>
							<div>
								<p className="text-white/50 text-sm">Badges</p>
								<div className="flex gap-2 mt-1">
									{user?.tester && (
										<div className="relative inline-block cursor-pointer">
											<div className="peer">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="24px"
													viewBox="0 -960 960 960"
													width="24px"
													fill="#e3e3e3"
												>
													<path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Z" />
												</svg>
											</div>
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
												Tester
											</div>
										</div>
									)}
									{user?.publisher && (
										<div className="relative inline-block cursor-pointer">
											<div className="peer">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="24px"
													viewBox="0 -960 960 960"
													width="24px"
													fill="#e3e3e3"
												>
													<path d="M440-91 160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm0-366v274l40 23 40-23v-274l240-139v-42l-43-25-237 137-237-137-43 25v42l240 139Z" />
												</svg>
											</div>
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
												Publisher
											</div>
										</div>
									)}
									{user?.moderator && (
										<div className="relative inline-block cursor-pointer">
											<div className="peer">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="24px"
													viewBox="0 -960 960 960"
													width="24px"
													fill="#e3e3e3"
												>
													<path d="M714-162 537-339l84-84 177 177q17 17 17 42t-17 42q-17 17-42 17t-42-17Zm-552 0q-17-17-17-42t17-42l234-234-68-68q-11 11-28 11t-28-11l-23-23v90q0 14-12 19t-22-5L106-576q-10-10-5-22t19-12h90l-22-22q-12-12-12-28t12-28l114-114q20-20 43-29t47-9q20 0 37.5 6t34.5 18q8 5 8.5 14t-6.5 16l-76 76 22 22q11 11 11 28t-11 28l68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q8 0 15 .5t14 2.5q9 3 11.5 12.5T737-809l-65 65q-6 6-6 14t6 14l44 44q6 6 14 6t14-6l65-65q7-7 16.5-5t12.5 12q2 7 2.5 14t.5 15q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L246-162q-17 17-42 17t-42-17Z" />
												</svg>
											</div>
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
												Moderator
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
