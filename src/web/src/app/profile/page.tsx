"use client";

import type { ExtendedUser, User } from "@/types/database";
import { supabase } from "@/utils/database";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// character limits
const CHAR_LIMITS = {
	username: 15,
	first_name: 15,
	bio: 200,
	location: 10,
};

export default function ProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<ExtendedUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedFields, setEditedFields] = useState({
		username: "",
		first_name: "",
		bio: "",
		location: "",
	});
	const [fieldErrors, setFieldErrors] = useState({
		username: "",
		first_name: "",
	});

	// check authentication and get user data
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError) {
					console.error("Session error:", sessionError);
					throw new Error(
						"Unable to verify your session. Please try logging in again.",
					);
				}

				if (!session) {
					router.push("/auth/login");
					return;
				}

				// fetch additional user data
				const { data: profileData, error: profileError } = await supabase
					.from("users")
					.select("*")
					.eq("id", session.user.id)
					.single();

				if (profileError) {
					console.error("Profile fetch error:", profileError);
					throw new Error(
						"Unable to load your profile data. Please try again later.",
					);
				}

				setUser({ ...session.user, ...profileData });
				setEditedFields({
					username: profileData?.username || "",
					first_name: profileData?.first_name || "",
					bio: profileData?.bio || "",
					location: profileData?.location || "",
				});
			} catch (err) {
				console.error("Auth error:", err);
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred. Please try again later.");
				}
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	// handle profile update
	const handleUpdateProfile = async () => {
		if (!user) return;

		// validate fields
		const errors = {
			username: !editedFields.username.trim() ? "Username is required" : "",
			first_name: !editedFields.first_name.trim() ? "Name is required" : "",
		};

		setFieldErrors(errors);

		// check if there are any errors
		if (Object.values(errors).some((error) => error)) {
			return;
		}

		try {
			const { error } = await supabase
				.from("users")
				.update(editedFields)
				.eq("id", user.id);

			if (error) throw error;

			setUser((prev) => (prev ? { ...prev, ...editedFields } : null));
			setIsEditing(false);
			setFieldErrors({ username: "", first_name: "" });
		} catch (err) {
			console.error("Update error:", err);
			setError(err instanceof Error ? err.message : "Failed to update profile");
		}
	};

	// handle sign out
	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			router.push("/auth/login");
		} catch (err) {
			console.error("Sign out error:", err);
			setError(err instanceof Error ? err.message : "Failed to sign out");
		}
	};

	// handle account deletion
	const handleDeleteAccount = async () => {
		setIsDeleting(true);
		try {
			const { error } = await supabase.auth.admin.deleteUser(user?.id || "");
			if (error) throw error;
			await supabase.auth.signOut();
			router.push("/auth/login");
		} catch (err) {
			console.error("Delete account error:", err);
			setError(err instanceof Error ? err.message : "Failed to delete account");
		} finally {
			setIsDeleting(false);
			setShowDeleteModal(false);
		}
	};

	// delete confirmation modal
	const DeleteConfirmationModal = () => (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white/10 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
				<h3 className="text-white text-xl font-semibold mb-4">
					Delete Account
				</h3>
				<p className="text-white/70 mb-6">
					Are you sure you want to delete your account? This action cannot be
					undone.
				</p>
				<div className="flex gap-4">
					<button
						onClick={() => setShowDeleteModal(false)}
						className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={handleDeleteAccount}
						disabled={isDeleting}
						className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 cursor-pointer"
					>
						{isDeleting ? "Deleting..." : "Delete Account"}
					</button>
				</div>
			</div>
		</div>
	);

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
							onClick={() => router.push("/auth/login")}
							className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
						>
							Return to Login
						</button>
					</div>
				</div>
			</div>
		);
	}

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
							<div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
								{user?.avatar_url ? (
									<Image
										src={user.avatar_url}
										alt="Profile"
										fill
										className="object-cover"
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
										{isEditing ? (
											<div className="flex flex-col gap-1">
												<input
													type="text"
													value={editedFields.first_name}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>,
													) => {
														setEditedFields((prev) => ({
															...prev,
															first_name: e.target.value,
														}));
														setFieldErrors((prev) => ({
															...prev,
															first_name: "",
														}));
													}}
													maxLength={CHAR_LIMITS.first_name}
													className={`bg-transparent border-b ${fieldErrors.first_name ? "border-red-500/50" : "border-white/20"} px-1 py-0.5 text-white w-full focus:outline-none`}
													placeholder="Your name"
												/>
												{fieldErrors.first_name && (
													<div className="text-red-400 text-sm">
														{fieldErrors.first_name}
													</div>
												)}
											</div>
										) : (
											user?.first_name || "No name set"
										)}
									</div>
									<div className="flex items-center gap-2 text-white/50 text-sm truncate max-w-[300px]">
										<span className="flex items-center">
											<span>@</span>
											{isEditing ? (
												<div className="flex flex-col gap-1">
													<div className="flex items-center">
														<input
															type="text"
															value={editedFields.username}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>,
															) => {
																setEditedFields((prev) => ({
																	...prev,
																	username: e.target.value,
																}));
																setFieldErrors((prev) => ({
																	...prev,
																	username: "",
																}));
															}}
															maxLength={CHAR_LIMITS.username}
															className={`bg-transparent border-b ${fieldErrors.username ? "border-red-500/50" : "border-white/20"} px-1 py-0.5 text-white w-full focus:outline-none`}
															placeholder="username"
														/>
													</div>
													{fieldErrors.username && (
														<div className="text-red-400 text-sm">
															{fieldErrors.username}
														</div>
													)}
												</div>
											) : (
												user?.username || "anonymous"
											)}
										</span>
										{/* location display */}
										{user?.location && (
											<>
												<span className="text-white/20">•</span>
												<div className="flex items-center gap-1">
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
													{isEditing ? (
														<motion.input
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															exit={{ opacity: 0 }}
															type="text"
															value={editedFields.location}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																setEditedFields((prev) => ({
																	...prev,
																	location: e.target.value,
																}))
															}
															maxLength={CHAR_LIMITS.location}
															className="bg-transparent border-b border-white/20 px-1 py-0.5 text-white w-full focus:outline-none"
															placeholder="Where are you from?"
														/>
													) : (
														<span className="text-white/70">
															{user?.location}
														</span>
													)}
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* bio and location section */}
						<div className="mt-6 space-y-4">
							<div className="p-4 rounded-lg bg-white/5 border border-white/10">
								<div className="space-y-4">
									{/* bio section */}
									<div>
										<h2 className="text-white/50 text-sm mb-2">About</h2>
										{isEditing ? (
											<motion.textarea
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												value={editedFields.bio}
												onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
													setEditedFields((prev) => ({
														...prev,
														bio: e.target.value,
													}))
												}
												maxLength={CHAR_LIMITS.bio}
												className="bg-transparent border-b border-white/20 px-1 py-0.5 text-white w-full min-h-[60px] resize-y focus:outline-none"
												placeholder="Tell us about yourself..."
											/>
										) : (
											<p className="text-white whitespace-pre-wrap line-clamp-4">
												{user?.bio || "No bio yet"}
											</p>
										)}
									</div>

									{/* edit profile button */}
									{!isEditing && (
										<div className="flex justify-end pt-4">
											<button
												onClick={() => setIsEditing(true)}
												className="px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="20px"
													viewBox="0 -960 960 960"
													width="20px"
													fill="currentColor"
												>
													<path d="M160-120q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm544-528 56-56-56-56-56 56 56 56Z" />
												</svg>
												Edit Profile
											</button>
										</div>
									)}

									{/* action buttons */}
									{isEditing && (
										<AnimatePresence>
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className="flex justify-end gap-2 pt-4"
											>
												<button
													onClick={handleUpdateProfile}
													className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 flex items-center gap-1.5 text-sm cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-3.5 w-3.5"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
													Save
												</button>
												<button
													onClick={() => {
														setIsEditing(false);
														setEditedFields({
															username: user?.username || "",
															first_name: user?.first_name || "",
															bio: user?.bio || "",
															location: user?.location || "",
														});
													}}
													className="px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center gap-1.5 text-sm cursor-pointer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-3.5 w-3.5"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
															clipRule="evenodd"
														/>
													</svg>
													Cancel
												</button>
											</motion.div>
										</AnimatePresence>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* account info section */}
					<div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
						<h2 className="text-white text-lg font-semibold">Information</h2>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<div>
								<p className="text-white/50 text-sm">Email</p>
								<p className="text-white truncate max-w-[200px] md:blur-sm md:hover:blur-none transition-all duration-300">
									{user?.email}
								</p>
							</div>
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
											? new Date(user.created_at).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
											  })
											: "N/A"}
									</div>
								</div>
							</div>
							<div>
								<p className="text-white/50 text-sm">Last Sign In</p>
								<div className="relative inline-block cursor-pointer">
									<div className="peer">
										<p className="text-white">
											{user?.last_sign_in_at
												? new Date(user.last_sign_in_at).toLocaleDateString()
												: "N/A"}
										</p>
									</div>
									<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
										{user?.last_sign_in_at
											? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
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
												
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Z"/></svg>
											</div>
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
												Tester
											</div>
										</div>
									)}
									{user?.publisher && (
										<div className="relative inline-block cursor-pointer">
											<div className="peer">
												

											<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-91 160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm0-366v274l40 23 40-23v-274l240-139v-42l-43-25-237 137-237-137-43 25v42l240 139Z"/></svg>

											</div>
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
												Publisher
											</div>
										</div>
									)}
									{user?.moderator && (
										<div className="relative inline-block cursor-pointer">
											<div className="peer">
												
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M714-162 537-339l84-84 177 177q17 17 17 42t-17 42q-17 17-42 17t-42-17Zm-552 0q-17-17-17-42t17-42l234-234-68-68q-11 11-28 11t-28-11l-23-23v90q0 14-12 19t-22-5L106-576q-10-10-5-22t19-12h90l-22-22q-12-12-12-28t12-28l114-114q20-20 43-29t47-9q20 0 37.5 6t34.5 18q8 5 8.5 14t-6.5 16l-76 76 22 22q11 11 11 28t-11 28l68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q8 0 15 .5t14 2.5q9 3 11.5 12.5T737-809l-65 65q-6 6-6 14t6 14l44 44q6 6 14 6t14-6l65-65q7-7 16.5-5t12.5 12q2 7 2.5 14t.5 15q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L246-162q-17 17-42 17t-42-17Z"/></svg>
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

					{/* account actions */}
					<div className="mt-6 flex items-center justify-between">
						<button
							onClick={handleSignOut}
							className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="20px"
								viewBox="0 -960 960 960"
								width="20px"
								fill="currentColor"
							>
								<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z" />
							</svg>
							Sign Out
						</button>
						<button
							onClick={() => setShowDeleteModal(true)}
							className="text-red-400/70 hover:text-red-400 text-sm transition-colors cursor-pointer"
						>
							Delete Account
						</button>
					</div>
				</div>
			</div>

			{/* delete confirmation modal */}
			{showDeleteModal && <DeleteConfirmationModal />}
		</div>
	);
}
