"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";
import ProfileStates from "@/components/profile/ProfileStates";
import ProfileTabContent from "@/components/profile/ProfileTabContent";
import ScriptModal from "@/components/profile/ScriptModal";
import ScriptsTabContent from "@/components/profile/ScriptsTabContent";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";

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
	const [activeTab, setActiveTab] = useState("profile");
	const [showScriptModal, setShowScriptModal] = useState(false);
	const [scriptForm, setScriptForm] = useState({
		name: "",
		description: "",
		script_url: "",
		logo_url: "",
		banner_url: "",
		version: "",
		tags: [] as string[],
	});
	const [scriptError, setScriptError] = useState("");
	const scriptFormRef = useRef<HTMLFormElement>(null);
	const [userScripts, setUserScripts] = useState<any[]>([]);
	const [scriptsLoading, setScriptsLoading] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [scriptSuccess, setScriptSuccess] = useState("");
	const [editScript, setEditScript] = useState<any | null>(null);

	const tagOptions = ["audio", "chat", "video", "image"];

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

	function handleScriptField(field: string, value: string) {
		setScriptForm((prev) => ({ ...prev, [field]: value }));
	}

	function handleTagToggle(tag: string) {
		setScriptForm((prev) => ({
			...prev,
			tags: prev.tags.includes(tag)
				? prev.tags.filter((t) => t !== tag)
				: [...prev.tags, tag],
		}));
	}

	async function handleScriptSubmit(e: React.FormEvent) {
		e.preventDefault();
		setScriptError("");
		const {
			name,
			description,
			script_url,
			logo_url,
			banner_url,
			version,
			tags,
		} = scriptForm;
		if (
			!name ||
			!description ||
			!script_url ||
			!logo_url ||
			!version ||
			tags.length === 0
		) {
			setScriptError("all fields required");
			return;
		}
		if (!profile) {
			setScriptError("not logged in");
			return;
		}
		// check pending scripts count
		const { count } = await supabase
			.from("scripts")
			.select("id", { count: "exact", head: false })
			.eq("author", profile.first_name || profile.username || "user")
			.eq("status", "pending");
		if ((count ?? 0) >= 3) {
			setScriptError("max 3 scripts pending review");
			return;
		}
		const author = profile.first_name || profile.username || "user";
		const author_url = `https://getdione.app/profile/${profile.username}`;
		const { error } = await supabase.from("scripts").insert({
			name,
			description,
			script_url,
			logo_url,
			banner_url: banner_url || null,
			version,
			tags: tags.join(","),
			author,
			author_url,
			likes: 0,
			downloads: 0,
			pending_review: true,
			official: false,
			status: "pending",
			review_feedback: null,
		});
		if (error) {
			setScriptError("failed to submit");
			return;
		}
		setShowScriptModal(false);
		setScriptForm({
			name: "",
			description: "",
			script_url: "",
			logo_url: "",
			banner_url: "",
			version: "",
			tags: [],
		});
		fetchUserScripts();
	}

	async function fetchUserScripts() {
		if (!profile) return;
		setScriptsLoading(true);
		const { data, error } = await supabase
			.from("scripts")
			.select("id,name,version,status,review_feedback")
			.eq("author", profile.first_name || profile.username || "user")
			.order("created_at", { ascending: false });
		if (!error) setUserScripts(data || []);
		setScriptsLoading(false);
	}

	useEffect(() => {
		if (activeTab === "scripts" && profile) fetchUserScripts();
	}, [activeTab, profile]);

	async function handleDeleteScript(id: string) {
		const { error } = await supabase.from("scripts").delete().eq("id", id);
		if (error) setScriptError("could not delete script");
		else {
			setScriptSuccess("script deleted");
			fetchUserScripts();
		}
		setDeleteId(null);
	}

	async function handleScriptUpdate(e: React.FormEvent) {
		e.preventDefault();
		setScriptError("");
		if (!editScript) return;
		const {
			name,
			description,
			script_url,
			logo_url,
			banner_url,
			version,
			tags,
			id,
		} = editScript;
		if (
			!name ||
			!description ||
			!script_url ||
			!logo_url ||
			!version ||
			!tags
		) {
			setScriptError("all fields required");
			return;
		}
		const { error } = await supabase
			.from("scripts")
			.update({
				name,
				description,
				script_url,
				logo_url,
				banner_url,
				version,
				tags: Array.isArray(tags) ? tags.join(",") : tags,
			})
			.eq("id", id);
		if (error) {
			setScriptError("failed to update");
			return;
		}
		setShowScriptModal(false);
		setEditScript(null);
		fetchUserScripts();
		setScriptSuccess("script updated");
	}

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
					{/* tabs */}
					<div className="flex mb-6 border-b border-white/10">
						<button
							onClick={() => setActiveTab("profile")}
							className={`px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "profile" ? "text-white border-b-2 border-white" : "text-white/50"}`}
						>
							Profile
						</button>
						<button
							onClick={() => setActiveTab("scripts")}
							className={`px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "scripts" ? "text-white border-b-2 border-white" : "text-white/50"}`}
						>
							Scripts
						</button>
					</div>

					{activeTab === "profile" && (
						<ProfileTabContent
							profile={profile}
							isEditing={isEditing}
							editedFields={editedFields}
							handleFieldChange={handleFieldChange}
							fieldErrors={fieldErrors}
							setIsEditing={setIsEditing}
							setEditedFields={setEditedFields}
							handleSubmit={handleSubmit}
							handleSignOut={handleSignOut}
							setShowDeleteModal={setShowDeleteModal}
							session={session}
						/>
					)}

					{activeTab === "scripts" && (
						<ScriptsTabContent
							setShowScriptModal={(s) => {
								if (s && typeof s === "object") {
									setEditScript({
										...s,
										tags: Array.isArray(s.tags)
											? s.tags
											: typeof s.tags === "string" && s.tags.length > 0
												? s.tags.split(",").map((t: string) => t.trim())
												: [],
									});
								}
								setShowScriptModal(true);
							}}
							scriptSuccess={scriptSuccess}
							scriptError={scriptError}
							scriptsLoading={scriptsLoading}
							userScripts={userScripts}
							setDeleteId={setDeleteId}
							deleteId={deleteId}
							handleDeleteScript={handleDeleteScript}
						/>
					)}
				</div>
			</div>

			{/* script modal */}
			{showScriptModal && (
				<ScriptModal
					show={showScriptModal}
					onClose={() => {
						setShowScriptModal(false);
						setEditScript(null);
					}}
					formRef={scriptFormRef}
					scriptForm={editScript || scriptForm}
					handleScriptField={handleScriptField}
					handleScriptSubmit={
						editScript ? handleScriptUpdate : handleScriptSubmit
					}
					tagOptions={tagOptions}
					handleTagToggle={handleTagToggle}
					scriptError={scriptError}
					isEdit={!!editScript}
				/>
			)}

			{/* delete confirmation modal */}
			<DeleteAccountModal
				show={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onDelete={handleDeleteAccount}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
