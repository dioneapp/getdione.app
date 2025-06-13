"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import type { Provider } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginHandler() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const isAppLogin = searchParams.get("app") === "true";
	const returnUrl = searchParams.get("returnUrl") || "/";
	const supabase = createSupabaseBrowserClient();
	const { session } = useSession();

	// redirect if already logged in
	useEffect(() => {
		if (session) {
			router.push(decodeURIComponent(returnUrl));
		}
	}, [session, returnUrl, router]);

	const handleLogin = async (provider: Provider) => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: provider,
				options: {
					redirectTo: `${location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
				},
			});
			if (error) throw error;
		} catch (error) {
			console.error("Login error:", error);
			// handle error appropriately
		}
	};

	return (
		<div
			className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative"
			id="container"
		>
			{/* background elements */}
			<div
				className="fixed inset-0 flex justify-center items-center"
				aria-hidden="true"
			>
				<div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
			</div>

			{/* main container */}
			<div className="h-fit w-full flex max-w-xl">
				<div className="w-full h-full group p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg">
					{/* welcome message */}
					<div className="flex flex-col gap-1">
						<h1 className="text-white text-3xl font-semibold">
							Log In to Dione
						</h1>
						<p className="text-white/70 text-sm">
							{isAppLogin
								? "Log In to access the Dione app."
								: "Log In to continue exploring and managing open-source AI apps effortlessly."}
						</p>
					</div>

					{/* login options */}
					<div className="mt-6 w-full h-10 flex gap-2">
						<button
							onClick={() => handleLogin("google")}
							className="rounded-full bg-white/10 w-full p-4 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
						>
							<svg
								className="w-5 h-5"
								viewBox="-3 0 262 262"
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="xMidYMid"
								fill="currentColor"
							>
								<path
									d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
									fill="currentColor"
								></path>
								<path
									d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
									fill="currentColor"
								></path>
								<path
									d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
									fill="currentColor"
								></path>
								<path
									d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
									fill="currentColor"
								></path>
							</svg>
						</button>

						<button
							onClick={() => handleLogin("discord")}
							className="rounded-full bg-white/10 w-full p-4 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
						>
							<svg
								className="w-5 h-5 overflow-visible"
								viewBox="0 0 256 199"
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="xMidYMid"
							>
								<path
									d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
									fill="currentColor"
								/>
							</svg>
						</button>

						<button
							onClick={() => handleLogin("github")}
							className="rounded-full bg-white/10 w-full p-4 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
						>
							<svg
								className="w-5 h-5"
								viewBox="0 0 256 250"
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="xMidYMid"
								fill="currentColor"
							>
								<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
							</svg>
						</button>
					</div>

					{/* terms of use and privacy policy */}
					<div className="mt-4 text-center text-white/70 text-sm">
						By logging in, you agree to our
						<a
							href="/terms-use"
							target="_blank"
							className="text-[#BCB1E7] hover:underline"
							rel="noreferrer"
						>
							{" "}
							Terms of Use
						</a>{" "}
						and
						<a
							href="/privacy-policy"
							target="_blank"
							className="text-[#BCB1E7] hover:underline"
							rel="noreferrer"
						>
							{" "}
							Privacy Policy
						</a>
						.
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense>
			<LoginHandler />
		</Suspense>
	);
}
