"use client";

import AccountInfo from "@/components/profile/AccountInfo";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStates from "@/components/profile/ProfileStates";
import type { ExtendedUser } from "@/types/database";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, X as XIcon, LogOut } from "lucide-react";

// character limits
const CHAR_LIMITS = {
	username: 15,
	first_name: 15,
	bio: 200,
	location: 10,
};

export default function ProfilePage() {
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();
	const { session, profile, isLoading, error: sessionError } = useSession();
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
		avatar_url: "",
	});
	const [fieldErrors, setFieldErrors] = useState({
		username: "",
		first_name: "",
	});

	// handle auth redirect
	useEffect(() => {
		if (!isLoading && !session) {
			router.push("/auth/login");
		}
	}, [session, isLoading, router]);

	// initialize form fields when profile loads
	useEffect(() => {
		if (profile) {
			setEditedFields({
				username: profile.username || "",
				first_name: profile.first_name || "",
				bio: profile.bio || "",
				location: profile.location || "",
				avatar_url: profile.avatar_url || "",
			});
			setLoading(false);
		}
	}, [profile]);

	// handle field changes
	const handleFieldChange = (
		field: keyof typeof editedFields,
		value: string,
	) => {
		setEditedFields((prev) => ({ ...prev, [field]: value }));
		setFieldErrors((prev) => ({ ...prev, [field]: "" }));
	};

	// handle form submission
	const handleSubmit = async () => {
		try {
			setError(null);

			// validate fields
			const errors = {
				username: "",
				first_name: "",
			};

			if (!editedFields.username.trim()) {
				errors.username = "Username is required";
			} else if (editedFields.username.length > CHAR_LIMITS.username) {
				errors.username = `Username must be ${CHAR_LIMITS.username} characters or less`;
			}

			if (editedFields.first_name.length > CHAR_LIMITS.first_name) {
				errors.first_name = `First name must be ${CHAR_LIMITS.first_name} characters or less`;
			}

			if (errors.username || errors.first_name) {
				setFieldErrors(errors);
				return;
			}

			const { error: updateError } = await supabase
				.from("users")
				.update({
					username: editedFields.username,
					first_name: editedFields.first_name,
					bio: editedFields.bio,
					location: editedFields.location,
				})
				.eq("id", session?.user.id);

			if (updateError) {
				// handle duplicate username error
				if (
					updateError.code === "23505" &&
					updateError.message.includes("username")
				) {
					setFieldErrors((prev) => ({
						...prev,
						username: "This username is already taken",
					}));
					return;
				}
				throw updateError;
			}

			// update local profile state
			if (profile) {
				profile.username = editedFields.username;
				profile.first_name = editedFields.first_name;
				profile.bio = editedFields.bio;
				profile.location = editedFields.location;
			}

			setIsEditing(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update profile");
		}
	};

	// handle account deletion
	const handleDeleteAccount = async () => {
		try {
			setIsDeleting(true);
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete account");
			setIsDeleting(false);
		}
	};

	// handle sign out
	const handleSignOut = async () => {
		try {
			await supabase.auth.signOut();
			// force redirect to home page
			window.location.href = "/";
		} catch (err) {
			console.error("Sign out error:", err);
			// force redirect even if there's an error
			window.location.href = "/";
		}
	};

	// show loading or error state
	if (isLoading || loading || error || sessionError) {
		return (
			<ProfileStates
				loading={isLoading || loading}
				error={error || sessionError?.message}
				onReturnHome={() => router.push("/auth/login")}
			/>
		);
	}

	return (
		<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-4 sm:p-12 pt-16 sm:pt-24 relative">
			{/* main container */}
			<div className="h-fit w-full flex max-w-xl">
				<div className="w-full h-full group p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg shadow-black/10">
					{/* profile header */}
					<div className="flex flex-col gap-2">
						<ProfileHeader
							user={profile}
							isEditing={isEditing}
							editedFields={editedFields}
							onFieldChange={handleFieldChange}
							fieldErrors={fieldErrors}
							onEditClick={() => setIsEditing(true)}
						/>
						<ProfileBio
							user={profile}
							isEditing={isEditing}
							editedBio={editedFields.bio}
							onBioChange={(value) => handleFieldChange("bio", value)}
						/>

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
										onClick={handleSubmit}
										className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 flex items-center gap-1.5 text-sm cursor-pointer"
									>
										<Check className="h-3.5 w-3.5" />
										Save
									</button>
									<button
										onClick={() => {
											setIsEditing(false);
											setEditedFields({
												username: profile?.username || "",
												first_name: profile?.first_name || "",
												bio: profile?.bio || "",
												location: profile?.location || "",
												avatar_url: profile?.avatar_url || "",
											});
										}}
										className="px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center gap-1.5 text-sm cursor-pointer"
									>
										<XIcon className="h-3.5 w-3.5" />
										Cancel
									</button>
								</motion.div>
							</AnimatePresence>
						)}
					</div>

					{/* account info section */}
					<AccountInfo
						user={profile}
						showEmail
						email={profile?.email}
						lastSignInAt={session?.user?.last_sign_in_at}
					/>

					{/* account actions */}
					<div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<button
							onClick={handleSignOut}
							className="w-full sm:w-auto shrink-0 py-1 px-5 flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-[#080808] cursor-pointer hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
						>
							<LogOut className="w-5 h-5" />
							Sign Out
						</button>
						<button
							onClick={() => setShowDeleteModal(true)}
							className="w-full sm:w-auto text-center text-red-400/70 hover:text-red-400 text-sm transition-colors cursor-pointer"
						>
							Delete Account
						</button>
					</div>
				</div>
			</div>

			{/* delete confirmation modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white/10 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
						<h3 className="text-white text-xl font-semibold mb-4">
							Delete Account
						</h3>
						<p className="text-white/70 mb-6">
							Are you sure you want to delete your account? This action cannot
							be undone.
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
			)}
		</div>
	);
}
