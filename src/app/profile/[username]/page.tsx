"use client";

import type { ExtendedUser } from "@/types/database";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import { use, useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import AccountInfo from "@/components/profile/AccountInfo";
import ProfileStates from "@/components/profile/ProfileStates";

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
] as const;

// cache for public profiles
const profileCache = new Map<string, ExtendedUser>();

export default function UserProfilePage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const supabase = createSupabaseBrowserClient();
	const { session, profile: currentUserProfile, isLoading: sessionLoading } = useSession();
	const [user, setUser] = useState<ExtendedUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { username } = use(params);

	// fetch user data
	useEffect(() => {
		let mounted = true;

		const fetchUser = async () => {
			try {
				// check cache first
				const cachedProfile = profileCache.get(username);
				if (cachedProfile) {
					setUser(cachedProfile);
					setLoading(false);
					return;
				}

				// fetch only public user data by username
				const { data: profileData, error: profileError } = await supabase
					.from("users")
					.select(PUBLIC_FIELDS.join(","))
					.eq("username", username)
					.single();

				if (!mounted) return;

				if (profileError) {
					if (profileError.code === "PGRST116") {
						throw new Error("User not found");
					}
					throw profileError;
				}

				if (!profileData) {
					throw new Error("No profile data found");
				}

				// type check the profile data
				if (typeof profileData === "object" && !("error" in profileData)) {
					const typedProfile = profileData as ExtendedUser;
					profileCache.set(username, typedProfile);
					setUser(typedProfile);
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

	// show loading or error state
	if (loading || sessionLoading || error) {
		return <ProfileStates loading={loading || sessionLoading} error={error} />;
	}

	// show profile
	return (
		<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-24 relative">

			{/* main container */}
			<div className="h-fit w-full flex max-w-xl">
				<div className="w-full h-full group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg shadow-black/10">
					{/* profile header */}
					<div className="flex flex-col gap-2">
						<ProfileHeader user={user} />
						<ProfileBio user={user} />
					</div>

					{/* account info section */}
					<AccountInfo user={user} />
				</div>
			</div>
		</div>
	);
}
