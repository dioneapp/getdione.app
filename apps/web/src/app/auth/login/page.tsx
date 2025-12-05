"use client";

import type { Provider } from "@supabase/supabase-js";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import LoginOptions from "@/components/auth/LoginOptions";
import LoginTerms from "@/components/auth/LoginTerms";
import LoginWelcome from "@/components/auth/LoginWelcome";
import { supabase } from "@/utils/database";
import useUser from "@/utils/use-user";

function LoginContent() {
	const { user } = useUser();
	const searchParams = useSearchParams();
	const isAppLogin = searchParams?.get("app") === "true";

	useEffect(() => {
		if (user && !isAppLogin) {
			redirect("/profile");
		}
	}, [user, isAppLogin]);

	const handleLogin = async (provider: Provider) => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/auth/callback/${isAppLogin ? "app" : "web"}`,
				},
			});

			if (error) {
				throw error;
			}
		} catch (error) {
			console.error("Error logging:", error);
		}
	};

	return (
		<div className="w-full max-w-md">
			<div className="w-full h-full group p-8 sm:p-10 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-xl space-y-6">
				<LoginWelcome isAppLogin={isAppLogin} />
				<LoginOptions handleLogin={handleLogin} />
				<LoginTerms />
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<div
			className="flex flex-col items-center w-full min-h-screen justify-center px-4 sm:px-6 py-20 -mt-16 sm:-mt-22"
			id="container"
		>
			<Suspense fallback={<div>Loading...</div>}>
				<LoginContent />
			</Suspense>
		</div>
	);
}
