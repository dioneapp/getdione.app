"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ProfileBio from "@/components/profile/account-bio";
import ProfileHeader from "@/components/profile/account-header";
import AccountInfo from "@/components/profile/account-info";
import ProfileStates from "@/components/profile/account-states";
import { supabase } from "@/utils/database";

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

type PublicUserProfile = {
	username: string;
	first_name: string | null;
	bio: string | null;
	location: string | null;
	avatar_url: string | null;
	created_at: string;
	tester: boolean | null;
	publisher: boolean | null;
	moderator: boolean | null;
};

export default function UserProfilePage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const [user, setUser] = useState<PublicUserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { username } = use(params);
	const router = useRouter();

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
					if (profileError.code === "PGRST116") {
						router.push("/404");
						return;
					}
					throw profileError;
				}

				if (!profileData) {
					router.push("/404");
					return;
				}

				// type check the profile data
				if (typeof profileData === "object" && !("error" in profileData)) {
					setUser(profileData);
					setLoading(false);
				} else {
					router.push("/404");
					return;
				}
			} catch (err) {
				if (!mounted) return;
				console.error("Fetch error:", err);
				setError(
					err instanceof Error
						? err.message
						: "An unexpected error occurred. Please try again later.",
				);
				setLoading(false);
			}
		};

		fetchUser();

		return () => {
			mounted = false;
		};
	}, [username, router]);

	// show loading or error state (but not for user not found)
	if (loading || error) {
		return <ProfileStates loading={loading} error={error} />;
	}

	// show profile
	return (
		<div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-4 sm:p-12 pt-12 sm:pt-16 relative">
			{/* main container */}
			<div className="h-fit w-full flex max-w-xl">
				<div className="w-full h-full group p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg shadow-black/10">
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
