"use client";

import type { AuthSession, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type { ExtendedUser } from "@/types/database";
import { createSupabaseBrowserClient } from "./browser-client";

interface SessionState {
	session: AuthSession | null;
	user: User | null;
	profile: ExtendedUser | null;
	isLoading: boolean;
	error: Error | null;
}

// cache for profile data
const profileCache = new Map<string, ExtendedUser>();

export default function useSession(): SessionState {
	const supabase = createSupabaseBrowserClient();
	const [sessionState, setSessionState] = useState<SessionState>({
		session: null,
		user: null,
		profile: null,
		isLoading: true,
		error: null,
	});

	const handleUserProfile = async (userId: string) => {
		try {
			// check cache first
			const cachedProfile = profileCache.get(userId);
			if (cachedProfile) return cachedProfile;

			const { data: profile, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", userId)
				.single();

			if (error?.code === "PGRST116") {
				const newProfile = {
					id: userId,
					username: userId.split("@")[0] || "user",
					first_name: "",
					bio: "",
					location: "",
					avatar_url: null,
					moderator: false,
				};

				const { data: createdProfile, error: createError } = await supabase
					.from("users")
					.insert(newProfile)
					.select()
					.single();

				if (createError) throw createError;
				if (createdProfile) {
					profileCache.set(userId, createdProfile);
					return createdProfile;
				}
			}

			if (error) throw error;
			if (profile) {
				profileCache.set(userId, profile);
				return profile;
			}
			return null;
		} catch (error) {
			console.error("Profile error:", error);
			throw error instanceof Error
				? error
				: new Error("Profile operation failed");
		}
	};

	const updateSessionState = async (session: AuthSession | null) => {
		try {
			if (!session?.user) {
				// clear profile cache on sign out
				if (sessionState.user?.id) {
					profileCache.delete(sessionState.user.id);
				}
				return {
					session: null,
					user: null,
					profile: null,
					isLoading: false,
					error: null,
				};
			}

			let profile = await handleUserProfile(session.user.id);

			// sync avatar if needed
			const authAvatar = session.user.user_metadata?.avatar_url;
			if (authAvatar && profile?.avatar_url !== authAvatar) {
				const { data: updatedProfile, error: updateError } = await supabase
					.from("users")
					.update({ avatar_url: authAvatar })
					.eq("id", session.user.id)
					.select()
					.single();

				if (updateError) throw updateError;
				if (updatedProfile) {
					profileCache.set(session.user.id, updatedProfile);
					profile = updatedProfile;
				}
			}

			return {
				session,
				user: session.user,
				profile: profile ? { ...session.user, ...profile } : null,
				isLoading: false,
				error: null,
			};
		} catch (error) {
			console.error("Session update error:", error);
			return {
				session: session,
				user: session?.user || null,
				profile: null,
				isLoading: false,
				error:
					error instanceof Error ? error : new Error("Session update failed"),
			};
		}
	};

	useEffect(() => {
		let isActive = true;

		const loadInitialSession = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				if (error) throw error;
				if (!isActive) return;

				const newState = await updateSessionState(session);
				if (isActive) setSessionState(newState);
			} catch (error) {
				if (isActive) {
					setSessionState((prev) => ({
						...prev,
						isLoading: false,
						error:
							error instanceof Error
								? error
								: new Error("Initial session failed"),
					}));
				}
			}
		};

		loadInitialSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!isActive) return;
			const newState = await updateSessionState(session);
			if (isActive) setSessionState(newState);
		});

		return () => {
			isActive = false;
			subscription?.unsubscribe();
		};
	}, []);

	return sessionState;
}
